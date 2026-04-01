import pool from '~~/server/utils/db'

export default defineEventHandler(async () => {
  const result = await pool.query(`
    SELECT
      p.id, p.name, p.image, p.is_active,
      COALESCE(
        json_agg(
          json_build_object('id', c.id, 'name', c.name, 'image', c.image)
          ORDER BY c.name
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'
      ) AS subcategories
    FROM categories p
    LEFT JOIN categories c ON c.parent_id = p.id
    WHERE p.parent_id IS NULL
    GROUP BY p.id, p.name, p.image, p.is_active
    ORDER BY p.name
  `)
  return result.rows
})