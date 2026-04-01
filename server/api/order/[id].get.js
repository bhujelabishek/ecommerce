import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const payload = verifyToken(token)
  const id = getRouterParam(event, 'id')

  const orderRes = await pool.query(
    `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
    [id, payload.id]
  )

  if (orderRes.rows.length === 0)
    throw createError({ statusCode: 404, message: 'Order not found' })

  const itemsRes = await pool.query(
    `SELECT * FROM order_items WHERE order_id = $1`,
    [id]
  )

  return { ...orderRes.rows[0], items: itemsRes.rows }
})