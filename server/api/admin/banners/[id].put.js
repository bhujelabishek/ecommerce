import pool from '~~/server/utils/db'
import { verifyToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401 })
  const payload = verifyToken(token)
  if (payload.role !== 'admin') throw createError({ statusCode: 403 })

  const id = getRouterParam(event, 'id')
  const { title, subtitle, button_text, button_link, image, overlay_color, is_active, sort_order } = await readBody(event)

  const result = await pool.query(
    `UPDATE hero_banners SET title=$1, subtitle=$2, button_text=$3, button_link=$4,
     image=$5, overlay_color=$6, is_active=$7, sort_order=$8 WHERE id=$9 RETURNING *`,
    [title, subtitle, button_text, button_link, image, overlay_color, is_active, sort_order, id]
  )
  return result.rows[0]
})