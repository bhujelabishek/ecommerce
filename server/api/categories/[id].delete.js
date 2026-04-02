export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const payload = verifyToken(token)
  console.log('ROLE:', payload.role)  // ← add here

  if (payload.role !== 'admin') throw createError({ statusCode: 403, message: 'Forbidden' })

  const id = getRouterParam(event, 'id')

  try {
    // ✅ first remove foreign key references from products
    await pool.query(`UPDATE products SET category_id = NULL WHERE category_id = $1`, [id])
    
    // ✅ then delete subcategories
    await pool.query(`DELETE FROM categories WHERE parent_id = $1`, [id])
    
    // ✅ then delete the category itself
    await pool.query(`DELETE FROM categories WHERE id = $1`, [id])

    return { success: true }

  } catch (err) {
    console.log('DELETE ERROR:', err.message)  // ← this will show exact error
    throw createError({ statusCode: 500, message: err.message })
  }
})