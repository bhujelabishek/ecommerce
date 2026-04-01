import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })
  const payload = verifyToken(token)
  if (payload.role !== 'admin') throw createError({ statusCode: 403, message: 'Forbidden' })

  const [revenue, orders, users, products] = await Promise.all([
    pool.query(`SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid'`),
    pool.query(`SELECT COUNT(*) as total FROM orders`),
    pool.query(`SELECT COUNT(*) as total FROM users`),
    pool.query(`SELECT COUNT(*) as total FROM products WHERE is_active = true`)
  ])

  return {
    revenue: revenue.rows[0].total,
    orders: orders.rows[0].total,
    users: users.rows[0].total,
    products: products.rows[0].total
  }
})