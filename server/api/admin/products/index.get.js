import pool from '~~/server/utils/db'

export default defineEventHandler(async () => {
  const result = await pool.query(`
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.stock,
    p.image,
    p.rating,
    p.is_active,
    p.created_at,
    p.category_id,
    c.name AS category
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  ORDER BY p.created_at DESC
`)

  return result.rows
})

