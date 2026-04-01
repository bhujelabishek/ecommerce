// server/api/products/[id].get.js
import pool from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const result = await pool.query(`
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
    WHERE p.id = $1 AND p.is_active = true
  `, [id])

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'Product not found' })
  }

  return result.rows[0]
})