import pool from "~~/server/utils/db"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  let sql = `
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.image,
      p.rating,
      p.stock,
      p.brand,
      p.category_id,
      c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = true
  `

  const values = []
  let i = 1

  if (query.category) {
    sql += ` AND p.category_id = $${i++}`
    values.push(query.category)
  }

  if (query.brand) {
    sql += ` AND p.brand = $${i++}`
    values.push(query.brand)
  }

  sql += ` ORDER BY p.created_at DESC`

  const result = await pool.query(sql, values)
  return result.rows
})