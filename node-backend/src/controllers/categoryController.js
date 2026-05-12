import db from '../db.js';

const toCategory = (row) => ({
  id: Number(row.id),
  name: row.name,
});

export const getCategories = async (_req, res, next) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM categories ORDER BY name ASC');
    res.json(rows.map(toCategory));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  const name = String(req.body?.name || '').trim();

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const [existingRows] = await db.query(
      'SELECT id, name FROM categories WHERE LOWER(name) = LOWER(?) LIMIT 1',
      [name]
    );

    if (existingRows.length) {
      return res.status(200).json(toCategory(existingRows[0]));
    }

    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ id: Number(result.insertId), name });
  } catch (error) {
    next(error);
  }
};

export const getCategoryProducts = async (req, res, next) => {
  const categoryId = Number(req.params.categoryId);

  if (!categoryId) {
    return res.status(400).json({ message: 'Valid category id is required' });
  }

  try {
    const [rows] = await db.query(
      `
        SELECT
          p.id,
          p.name,
          p.description,
          p.price,
          p.image_url,
          p.category_id,
          p.created_at,
          c.name AS category_name
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        WHERE p.category_id = ?
        ORDER BY p.created_at DESC
      `,
      [categoryId]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};
