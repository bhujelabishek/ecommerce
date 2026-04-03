import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401 })
  const payload = verifyToken(token)
  if (payload.role !== 'admin') throw createError({ statusCode: 403 })

  const { title, subtitle, button_text, button_link, image, overlay_color, is_active, sort_order } = await readBody(event)

  const result = await pool.query(
    `INSERT INTO hero_banners (title, subtitle, button_text, button_link, image, overlay_color, is_active, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [title, subtitle, button_text || 'Shop Now', button_link || '/products', image, overlay_color || 'rgba(0,0,0,0.4)', is_active ?? true, sort_order || 0]
  )
  return result.rows[0]
})