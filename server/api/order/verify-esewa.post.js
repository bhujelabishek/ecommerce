import pool from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { oid, amt, refId } = await readBody(event)

  // verify with eSewa
  const verifyRes = await $fetch(
    `https://uat.esewa.com.np/epay/transrec`,  // use https://esewa.com.np/epay/transrec in production
    {
      method: 'POST',
      body: new URLSearchParams({
        amt,
        scd: process.env.ESEWA_SCD || 'EPAYTEST', 
        // my organization merchant code
        rid: refId,
        pid: oid
      }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  )

  if (verifyRes.includes('Success')) {
    // update order payment status below code
    await pool.query(
      `UPDATE orders SET payment_status = 'paid', esewa_ref_id = $1, status = 'processing'
       WHERE id = $2`,
      [refId, oid]
    )
    return { success: true }
  }

  throw createError({ statusCode: 400, message: 'Payment verification failed' })
})