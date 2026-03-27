// server/api/test-db.get.js

import pool from "../utils/db"

export default defineEventHandler(async () => {
    // return {
    //     message: "API is working"
    // }
  try {
    const res = await pool.query('SELECT NOW()')

    return {
      success: true,
      message: 'Database connected ✅',
      time: res.rows[0]
    }
  } catch (err) {
    return {
      success: false,
      message: 'Database failed ❌',
      error: err.message
    }
  }
})