import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = event.req.headers.authorization?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401 })

  verifyToken(token)

  const body = await readBody(event)

  const result = await pool.query(
    `INSERT INTO products 
    (name, description, price, stock, image, category_id, rating, is_active)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      body.name,
      body.description,
      body.price,
      body.stock,
      body.image,
      body.category_id,
      body.rating,
      body.is_active
    ]
  )

  return result.rows[0]
})