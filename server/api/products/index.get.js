// export default defineEventHandler(() => {
//   return { message: 'API working' }
// })



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
      c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = true
  `

  const values = []

  // 👉 only apply filter if category exists
  if (query.category) {
    values.push(query.category)
    sql += ` AND p.category_id = $1`
  }

  sql += ` ORDER BY p.created_at DESC`

  const result = await pool.query(sql, values)

  return result.rows
})