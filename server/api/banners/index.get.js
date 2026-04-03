import pool from '~~/server/utils/db'

export default defineEventHandler(async () => {
  const result = await pool.query(`
    SELECT * FROM hero_banners
    WHERE is_active = true
    ORDER BY sort_order ASC
  `)
  return result.rows
})