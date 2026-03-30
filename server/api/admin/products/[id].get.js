import pool from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  const result = await pool.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  )

  if (!result.rows.length) {
    throw createError({ statusCode: 404, message: 'Product not found' })
  }

  return result.rows[0]
})