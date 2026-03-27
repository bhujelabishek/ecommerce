import pool from '~~/server/utils/db'
import { comparePassword } from '~~/server/utils/hash'
import { generateToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [body.email]
  )

  const user = result.rows[0]

  if (!user) throw createError({ statusCode: 401, message: 'User not found' })

  const valid = await comparePassword(body.password, user.password)

  if (!valid) throw createError({ statusCode: 401, message: 'Invalid password' })

  const token = generateToken(user)
    console.log('USER ID:', user) // 👈 DEBUG

  return { token }
})