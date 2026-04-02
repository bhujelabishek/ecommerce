import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  
  const authHeader = getHeader(event, 'authorization')  // ✅ nuxt way to get headers
  const token = authHeader ? authHeader.split(' ')[1] : null

  // DEBUGGING KO LAGI KAMM LAGCHA
  console.log('TOKEN RECEIVED:', token) 

  if (!token) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  // verify token and get payload
  const payload = verifyToken(token)
  console.log('PAYLOAD:', payload)

  // GET USER INFO FROM DB
  const result = await pool.query(
    'SELECT id, first_name, last_name, email, age,role FROM users WHERE id=$1',
    [payload.id]
  )
// User not found case
  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return { user: result.rows[0] }
})