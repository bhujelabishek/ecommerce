import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {

  // get token safely
  const authHeader = event.req.headers.authorization
  const token = authHeader ? authHeader.split(' ')[1] : null

  console.log('TOKEN RECEIVED:', token) // DEBUG

  if (!token) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  // verify token
  const payload = verifyToken(token)
  console.log('PAYLOAD:', payload)

  // get user
  const result = await pool.query(
    'SELECT id, first_name, last_name, email, age FROM users WHERE id=$1',
    [payload.id]
  )

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return { user: result.rows[0] }
})