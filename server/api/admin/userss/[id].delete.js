import pool from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  await pool.query('DELETE FROM users WHERE id = $1', [id])

  return { message: 'User deleted successfully' }
})