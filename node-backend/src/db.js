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
        description TEXT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        image_url VARCHAR(500) NULL,
        category_id BIGINT NOT NULL,
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
