import db from '../db.js';

const mapProduct = (row) => ({
  id: Number(row.id),
  name: row.name,
  description: row.description,
  price: Number(row.price),
  stock: Number(row.stock ?? 0),
  image_url: row.image_url,
  category_id: Number(row.category_id),
  category_name: row.category_name,
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
          p.description,
          p.price,
          p.stock,
          p.image_url,
          p.category_id,
          p.created_at,
          c.name AS category_name
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
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
  const description = String(req.body?.description || '').trim();
  const imageUrl = String(req.body?.image_url || '').trim();
  const price = Number(req.body?.price);
  const stock = Number(req.body?.stock ?? 0);
  const categoryId = Number(req.body?.category_id);
  const newCategoryName = String(req.body?.new_category_name || req.body?.newCategoryName || '').trim();

  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  if (!Number.isFinite(price)) {
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

    const [insertResult] = await connection.query(
      'INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, price, stock, imageUrl || null, resolvedCategoryId]
    );

    const [rows] = await connection.query(
      `
        SELECT
          p.id,
          p.name,
          p.description,
          p.price,
          p.stock,
          p.image_url,
          p.category_id,
          p.created_at,
          c.name AS category_name
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
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
