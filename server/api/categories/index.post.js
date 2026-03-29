import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = event.req.headers.authorization?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401 })

  verifyToken(token)

  const body = await readBody(event)

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Category name required'
    })
  }

  const result = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [body.name]
  )

  return result.rows[0]
})