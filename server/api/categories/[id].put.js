export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const payload = verifyToken(token)
  console.log('ROLE:', payload.role)  // ← add here

  if (payload.role !== 'admin') throw createError({ statusCode: 403, message: 'Forbidden' })

  const id = getRouterParam(event, 'id')
  const { name, parent_id, image, is_active } = await readBody(event)

  try {
    const result = await pool.query(
      `UPDATE categories SET name = $1, parent_id = $2, image = $3, is_active = $4 WHERE id = $5 RETURNING *`,
      [name, parent_id || null, image || null, is_active ?? true, id]
    )

    if (result.rows.length === 0) throw createError({ statusCode: 404, message: 'Not found' })

    return result.rows[0]

  } catch (err) {
    console.log('UPDATE ERROR:', err.message)  // ← exact error
    throw createError({ statusCode: 500, message: err.message })
  }
})