import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })
  const payload = verifyToken(token)
  if (payload.role !== 'admin') throw createError({ statusCode: 403, message: 'Forbidden' })

  const result = await pool.query(`
    SELECT o.*, u.first_name, u.last_name, u.email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `)
  return result.rows
})