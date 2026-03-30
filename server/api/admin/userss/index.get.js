import pool from '~~/server/utils/db'

export default defineEventHandler(async () => {
  const result = await pool.query(`
    SELECT 
      id,
      first_name,
      last_name,
      email,
      role,
      created_at,
      -- fake is_active for now
     is_active
    FROM users
    ORDER BY created_at DESC
  `)
  return result.rows
})