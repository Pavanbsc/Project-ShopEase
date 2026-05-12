import db from '../db.js';

const mapProduct = (row) => ({
  id: Number(row.id),
  name: row.name,
  brand_name: row.brand_name || null,
  seller: row.seller,
  seller_rating: row.seller_rating ? Number(row.seller_rating) : null,
  seller_type: row.seller_type || 'Standard',
  seller_location: row.seller_location || null,
  description: row.description,
  specifications: row.specifications ? JSON.parse(row.specifications) : {},
  original_price: row.original_price ? Number(row.original_price) : null,
  discount_percentage: row.discount_percentage ? Number(row.discount_percentage) : 0,
  final_price: row.final_price ? Number(row.final_price) : Number(row.price ?? 0),
  price: Number(row.price),
  stock: Number(row.stock ?? 0),
  stock_status: row.stock_status || 'In Stock',
  image_url: row.image_url,
  category_id: Number(row.category_id),
  category_name: row.category_name,
  subcategory_id: row.subcategory_id ? Number(row.subcategory_id) : null,
  subcategory_name: row.subcategory_name || null,
  created_at: row.created_at,
  category: {
    id: Number(row.category_id),
    name: row.category_name,
  },
});

export const getProducts = async (_req, res, next) => {
  try {
    const [rows] = await db.query(
      `
        SELECT
          p.id,
          p.name,
          p.brand_name,
          p.seller,
          p.seller_rating,
          p.seller_type,
          p.seller_location,
          p.description,
          p.specifications,
          p.original_price,
          p.discount_percentage,
          p.final_price,
          p.price,
          p.stock,
          p.stock_status,
          p.image_url,
          p.category_id,
          p.subcategory_id,
          p.created_at,
          c.name AS category_name,
          sc.name AS subcategory_name
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        LEFT JOIN categories sc ON sc.id = p.subcategory_id
        ORDER BY p.created_at DESC
      `
    );

    res.json(rows.map(mapProduct));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  const name = String(req.body?.name || '').trim();
  const brand_name = String(req.body?.brand_name || '').trim();
  const seller = String(req.body?.seller || '').trim();
  const seller_rating = Number(req.body?.seller_rating || 0);
  const seller_type = String(req.body?.seller_type || 'Standard').trim();
  const seller_location = String(req.body?.seller_location || '').trim();
  const description = String(req.body?.description || '').trim();
  const specifications = req.body?.specifications || {};
  const original_price = Number(req.body?.original_price || 0);
  const discount_percentage = Number(req.body?.discount_percentage || 0);
  const final_price = Number(req.body?.final_price || req.body?.price || 0);
  const imageUrl = String(req.body?.image_url || '').trim();
  const price = Number(req.body?.price || final_price);
  const stock = Number(req.body?.stock ?? 0);
  const stock_status = stock > 0 ? 'In Stock' : 'Out of Stock';
  const categoryId = Number(req.body?.category_id);
  const newCategoryName = String(req.body?.new_category_name || req.body?.newCategoryName || '').trim();

  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  if (!seller) {
    return res.status(400).json({ message: 'Seller is required' });
  }

  if (!Number.isFinite(price) || price <= 0) {
    return res.status(400).json({ message: 'Valid product price is required' });
  }

  if (!Number.isFinite(stock) || stock < 0) {
    return res.status(400).json({ message: 'Valid product stock is required' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    let resolvedCategoryId = categoryId;
    let resolvedCategoryName = '';

    if (newCategoryName) {
      const [existingRows] = await connection.query(
        'SELECT id, name FROM categories WHERE LOWER(name) = LOWER(?) LIMIT 1',
        [newCategoryName]
      );

      if (existingRows.length) {
        resolvedCategoryId = Number(existingRows[0].id);
        resolvedCategoryName = existingRows[0].name;
      } else {
        const [insertCategoryResult] = await connection.query(
          'INSERT INTO categories (name) VALUES (?)',
          [newCategoryName]
        );
        resolvedCategoryId = Number(insertCategoryResult.insertId);
        resolvedCategoryName = newCategoryName;
      }
    }

    if (!resolvedCategoryId) {
      await connection.rollback();
      return res.status(400).json({ message: 'Valid category id is required' });
    }

    const [categoryRows] = await connection.query('SELECT id, name FROM categories WHERE id = ? LIMIT 1', [resolvedCategoryId]);
    if (!categoryRows.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Selected category does not exist' });
    }

    const specificationsJson = JSON.stringify(specifications);

    const [insertResult] = await connection.query(
      `INSERT INTO products (
        name, brand_name, seller, seller_rating, seller_type, seller_location, 
        description, specifications, original_price, discount_percentage, final_price,
        price, stock, stock_status, image_url, category_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, brand_name || null, seller, seller_rating || null, seller_type, seller_location || null,
        description || null, specificationsJson, original_price || null, discount_percentage, final_price,
        price, stock, stock_status, imageUrl || null, resolvedCategoryId
      ]
    );

    const [rows] = await connection.query(
      `
        SELECT
          p.id,
          p.name,
          p.brand_name,
          p.seller,
          p.seller_rating,
          p.seller_type,
          p.seller_location,
          p.description,
          p.specifications,
          p.original_price,
          p.discount_percentage,
          p.final_price,
          p.price,
          p.stock,
          p.stock_status,
          p.image_url,
          p.category_id,
          p.subcategory_id,
          p.created_at,
          c.name AS category_name,
          sc.name AS subcategory_name
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        LEFT JOIN categories sc ON sc.id = p.subcategory_id
        WHERE p.id = ?
        LIMIT 1
      `,
      [insertResult.insertId]
    );

    await connection.commit();
    const product = rows.length ? mapProduct(rows[0]) : { id: Number(insertResult.insertId) };

    if (resolvedCategoryName && !product.category_name) {
      product.category_name = resolvedCategoryName;
      product.category = {
        id: resolvedCategoryId,
        name: resolvedCategoryName,
      };
    }

    res.status(201).json(product);
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const deleteProduct = async (req, res, next) => {
  const productId = Number(req.params.id);

  if (!Number.isFinite(productId) || productId <= 0) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [productId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
