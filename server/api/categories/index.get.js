import pool from '~~/server/utils/db'

export default defineEventHandler(async () => {
  const result = await pool.query('SELECT * FROM categories ORDER BY id')
  return result.rows
})