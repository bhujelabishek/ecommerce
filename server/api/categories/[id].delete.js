import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const payload = verifyToken(token)
  if (payload.role !== 'admin') throw createError({ statusCode: 403, message: 'Forbidden' })

  const id = getRouterParam(event, 'id')

  // delete subcategories first, then parent
  await pool.query(`DELETE FROM categories WHERE parent_id = $1`, [id])
  await pool.query(`DELETE FROM categories WHERE id = $1`, [id])

  return { success: true }
})