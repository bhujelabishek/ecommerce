import pool from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)

  if (!q || q.trim().length < 2) return []

  const result = await pool.query(`
    SELECT
      p.id, p.name, p.price, p.image, p.rating, p.stock,
      c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = true
      AND (
        p.name ILIKE $1 OR
        p.description ILIKE $1 OR
        p.brand ILIKE $1 OR
        c.name ILIKE $1
      )
    ORDER BY p.rating DESC
    LIMIT 20
  `, [`%${q.trim()}%`])

  return result.rows
})