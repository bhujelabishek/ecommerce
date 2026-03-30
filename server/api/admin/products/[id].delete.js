import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const token = event.req.headers.authorization?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401 })
  verifyToken(token)

  const body = await readBody(event)

  const result = await pool.query(
    `UPDATE products SET
      name = $1,
      description = $2,
      price = $3,
      stock = $4,
      image = $5,
      category_id = $6,
      rating = $7,
      is_active = $8
    WHERE id = $9
    RETURNING *`,
    [
      body.name,
      body.description,
      body.price,
      body.stock,
      body.image,
      body.category_id,
      body.rating,
      body.is_active,
      id
    ]
  )

  return result.rows[0]
})