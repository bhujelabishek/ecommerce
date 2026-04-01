import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const payload = verifyToken(token)
  const { items, total_amount, full_name, phone, address, city, notes, payment_method } = await readBody(event)

  if (!items?.length) throw createError({ statusCode: 400, message: 'No items in order' })

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // create order
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, full_name, phone, address, city, notes, payment_method, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', 'unpaid') RETURNING *`,
      [payload.id, total_amount, full_name, phone, address, city, notes, payment_method || 'esewa']
    )

    const order = orderRes.rows[0]

    // insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity, image)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.id, item.name, item.price, item.qty, item.image]
      )
    }

    await client.query('COMMIT')
    return order

  } catch (err) {
    await client.query('ROLLBACK')
    throw createError({ statusCode: 500, message: 'Order creation failed' })
  } finally {
    client.release()
  }
})