import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, message: 'Login required' })

  const payload = verifyToken(token)
  const id = getRouterParam(event, 'id')
  const { rating, comment } = await readBody(event)

  if (!rating || rating < 1 || rating > 5)
    throw createError({ statusCode: 400, message: 'Rating must be 1-5' })

  // check if user already reviewed
  const existing = await pool.query(
    'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
    [id, payload.id]
  )
  if (existing.rows.length > 0)
    throw createError({ statusCode: 400, message: 'You already reviewed this product' })

  const result = await pool.query(
    `INSERT INTO reviews (product_id, user_id, rating, comment)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [id, payload.id, rating, comment || null]
  )

  // update product average rating
  await pool.query(`
    UPDATE products SET rating = (
      SELECT ROUND(AVG(rating)) FROM reviews WHERE product_id = $1
    ) WHERE id = $1
  `, [id])

  return result.rows[0]
})