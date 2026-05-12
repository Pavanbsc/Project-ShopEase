import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'shopease_db';

const REQUIRED_CATEGORIES = [
  'Electronics',
  'Mobile Phones',
  'Laptops',
  'Tablets',
  'Accessories',
  'Clothing',
  'Mens Fashion',
  'Womens Fashion',
  'Kids Wear',
  'Footwear',
  'Sports Shoes',
  'Home Appliance',
  'Kitchen Appliance',
  'Furniture',
];

const safeDbName = DB_NAME.replace(/`/g, '');

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

export const initializeDatabase = async () => {
  const bootstrapConnection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  try {
    // Keep the shared database intact so auth tables are not wiped on product backend restart.
    await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${safeDbName}\``);
  } finally {
    await bootstrapConnection.end();
  }

  const connection = await pool.getConnection();

  try {
    // Create categories table with BIGINT ids to match other services
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id BIGINT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uq_categories_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create products table with BIGINT foreign key to categories.id
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id BIGINT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        brand_name VARCHAR(255) NULL,
        seller VARCHAR(255) NOT NULL,
        seller_rating DECIMAL(3,2) DEFAULT NULL,
        seller_type ENUM('Standard', 'Verified', 'Premium') DEFAULT 'Standard',
        seller_location VARCHAR(255) NULL,
        description TEXT NULL,
        specifications JSON NULL,
        original_price DECIMAL(10,2) NULL,
        discount_percentage DECIMAL(5,2) DEFAULT 0,
        final_price DECIMAL(10,2) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        stock_status ENUM('In Stock', 'Out of Stock') DEFAULT 'In Stock',
        image_url VARCHAR(500) NULL,
        category_id BIGINT NOT NULL,
        subcategory_id BIGINT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_products_category_id (category_id),
        CONSTRAINT fk_products_category
          FOREIGN KEY (category_id) REFERENCES categories(id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // If the products table already existed before stock was added, add the column safely.
    const [stockColumnRows] = await connection.query(
      `
        SELECT COUNT(*) AS column_count
        FROM information_schema.columns
        WHERE table_schema = ?
          AND table_name = 'products'
          AND column_name = 'stock'
      `,
      [DB_NAME]
    );

    if (Number(stockColumnRows?.[0]?.column_count || 0) === 0) {
      await connection.query('ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 0 AFTER price');
    }

    // If the products table existed before seller was introduced, add it safely.
    const [sellerColumnRows] = await connection.query(
      `
        SELECT COUNT(*) AS column_count
        FROM information_schema.columns
        WHERE table_schema = ?
          AND table_name = 'products'
          AND column_name = 'seller'
      `,
      [DB_NAME]
    );

    if (Number(sellerColumnRows?.[0]?.column_count || 0) === 0) {
      await connection.query("ALTER TABLE products ADD COLUMN seller VARCHAR(255) NOT NULL DEFAULT 'Unknown Seller' AFTER name");
    }

    // Add new product fields if they don't exist
    const [brandNameRows] = await connection.query(
      `SELECT COUNT(*) AS column_count FROM information_schema.columns WHERE table_schema = ? AND table_name = 'products' AND column_name = 'brand_name'`,
      [DB_NAME]
    );
    if (Number(brandNameRows?.[0]?.column_count || 0) === 0) {
      await connection.query("ALTER TABLE products ADD COLUMN brand_name VARCHAR(255) NULL AFTER name");
    }

    const [sellerRatingRows] = await connection.query(
      `SELECT COUNT(*) AS column_count FROM information_schema.columns WHERE table_schema = ? AND table_name = 'products' AND column_name = 'seller_rating'`,
      [DB_NAME]
    );
    if (Number(sellerRatingRows?.[0]?.column_count || 0) === 0) {
      await connection.query("ALTER TABLE products ADD COLUMN seller_rating DECIMAL(3,2) DEFAULT NULL AFTER seller");
      await connection.query("ALTER TABLE products ADD COLUMN seller_type ENUM('Standard', 'Verified', 'Premium') DEFAULT 'Standard' AFTER seller_rating");
      await connection.query("ALTER TABLE products ADD COLUMN seller_location VARCHAR(255) NULL AFTER seller_type");
    }

    const [specificationsRows] = await connection.query(
      `SELECT COUNT(*) AS column_count FROM information_schema.columns WHERE table_schema = ? AND table_name = 'products' AND column_name = 'specifications'`,
      [DB_NAME]
    );
    if (Number(specificationsRows?.[0]?.column_count || 0) === 0) {
      await connection.query("ALTER TABLE products ADD COLUMN specifications JSON NULL AFTER description");
    }

    const [originalPriceRows] = await connection.query(
      `SELECT COUNT(*) AS column_count FROM information_schema.columns WHERE table_schema = ? AND table_name = 'products' AND column_name = 'original_price'`,
      [DB_NAME]
    );
    if (Number(originalPriceRows?.[0]?.column_count || 0) === 0) {
      await connection.query("ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2) NULL AFTER specifications");
      await connection.query("ALTER TABLE products ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0 AFTER original_price");
      await connection.query("ALTER TABLE products ADD COLUMN final_price DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER discount_percentage");
    }

    const [stockStatusRows] = await connection.query(
      `SELECT COUNT(*) AS column_count FROM information_schema.columns WHERE table_schema = ? AND table_name = 'products' AND column_name = 'stock_status'`,
      [DB_NAME]
    );
    if (Number(stockStatusRows?.[0]?.column_count || 0) === 0) {
      await connection.query("ALTER TABLE products ADD COLUMN stock_status ENUM('In Stock', 'Out of Stock') DEFAULT 'In Stock' AFTER stock");
    }

    const [subcategoryRows] = await connection.query(
      `SELECT COUNT(*) AS column_count FROM information_schema.columns WHERE table_schema = ? AND table_name = 'products' AND column_name = 'subcategory_id'`,
      [DB_NAME]
    );
    if (Number(subcategoryRows?.[0]?.column_count || 0) === 0) {
      await connection.query("ALTER TABLE products ADD COLUMN subcategory_id BIGINT NULL AFTER category_id");
    }

    // Create product images table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id BIGINT NOT NULL AUTO_INCREMENT,
        product_id BIGINT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        is_main BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_product_images_product_id (product_id),
        CONSTRAINT fk_product_images_product
          FOREIGN KEY (product_id) REFERENCES products(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create product variants table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id BIGINT NOT NULL AUTO_INCREMENT,
        product_id BIGINT NOT NULL,
        color VARCHAR(100) NULL,
        size VARCHAR(100) NULL,
        storage VARCHAR(100) NULL,
        variant_stock INT DEFAULT 0,
        variant_price DECIMAL(10,2) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_product_variants_product_id (product_id),
        CONSTRAINT fk_product_variants_product
          FOREIGN KEY (product_id) REFERENCES products(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await connection.query(
      `
        UPDATE products
        SET seller = 'ShopEase Seller'
        WHERE seller IS NULL
           OR TRIM(seller) = ''
           OR LOWER(TRIM(seller)) = 'unknown seller'
      `
    );

    // Insert required categories
    const categoryPlaceholders = REQUIRED_CATEGORIES.map(() => '(?)').join(', ');
    await connection.query(
      `INSERT IGNORE INTO categories (name) VALUES ${categoryPlaceholders}`,
      REQUIRED_CATEGORIES
    );

      console.log(`✓ Database initialized with ${REQUIRED_CATEGORIES.length} categories`);
    } catch (error) {
      console.error('Database initialization error:', error.message);
      throw error;
  } finally {
    connection.release();
  }
};

export default pool;
