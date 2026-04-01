import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })
  const payload = verifyToken(token)
  if (payload.role !== 'admin') throw createError({ statusCode: 403, message: 'Forbidden' })

  const id = getRouterParam(event, 'id')
  const { status } = await readBody(event)

  const result = await pool.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  )
  return result.rows[0]
})