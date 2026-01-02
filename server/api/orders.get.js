// /server/api/orders.get.js
import db, { initError } from '../db'

export default defineEventHandler((event) => {
  try {
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database not initialized',
        data: initError || 'Database connection failed'
      })
    }

    const query = getQuery(event)
    const { dateFrom, dateTo } = query

    let sql = `
      SELECT 
        o.id,
        o.product_id,
        o.quantity,
        o.created_at,
        p.name as product_name,
        p.price as unit_price
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
    `
    
    const conditions = []
    const params = []
    
    if (dateFrom) {
      conditions.push('o.created_at >= ?')
      params.push(dateFrom)
    }
    
    if (dateTo) {
      conditions.push('o.created_at <= ?')
      params.push(dateTo + ' 23:59:59')
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }
    
    sql += ' ORDER BY o.created_at DESC'
    
    const orders = params.length > 0 
      ? db.prepare(sql).all(...params)
      : db.prepare(sql).all()
    
    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch orders',
      data: error.message
    })
  }
})
