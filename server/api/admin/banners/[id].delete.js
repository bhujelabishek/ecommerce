import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401 })
  const payload = verifyToken(token)
  if (payload.role !== 'admin') throw createError({ statusCode: 403 })

  await pool.query('DELETE FROM hero_banners WHERE id = $1', [getRouterParam(event, 'id')])
  return { success: true }
})