// /server/api/orders/[id].delete.js
import db, { initError } from '../../db'

export default defineEventHandler(async (event) => {
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database not initialized',
      data: initError || 'Database connection failed'
    })
  }

  const id = getRouterParam(event, 'id')
  
  // Check if order exists
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id)
  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Order not found'
    })
  }
  
  // Get product info to restore stock
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(order.product_id)
  if (product) {
    // Restore stock
    db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(order.quantity, order.product_id)
  }
  
  // Delete order
  db.prepare('DELETE FROM orders WHERE id = ?').run(id)
  
  return { success: true, message: 'Order deleted successfully' }
})
