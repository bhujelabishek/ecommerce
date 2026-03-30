export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const body = await readBody(event)
  const { role, is_active } = body

  await pool.query(
    'UPDATE users SET role=$1, is_active=$2 WHERE id=$3',
    [role, is_active, id]
  )

  return { message: 'User updated successfully' }
})