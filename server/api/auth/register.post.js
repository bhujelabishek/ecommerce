import pool from '~~/server/utils/db'
import { hashPassword } from '~~/server/utils/hash'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // validation
  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, message: 'Missing fields' })
  }

  if (body.password.length < 6) {
    throw createError({ statusCode: 400, message: 'Password too short' })
  }

  if (body.age < 18) {
    throw createError({ statusCode: 400, message: 'Must be 18+' })
  }

  const hashed = await hashPassword(body.password)

  await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, age)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      body.firstName,
      body.lastName,
      body.email,
      hashed,
      body.age
    ]
  )

  return { message: 'User created' }
})