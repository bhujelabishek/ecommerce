import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401 })
  const payload = verifyToken(token)
  if (payload.role !== 'admin') throw createError({ statusCode: 403 })

  const result = await pool.query(`SELECT * FROM hero_banners ORDER BY sort_order ASC`)
  return result.rows
})