import pool from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const result = await pool.query(`
    SELECT id, name, price, image
    FROM products
    WHERE category_id = $1 AND is_active = true
    ORDER BY rating DESC
    LIMIT 3
  `, [id])

  return result.rows
})