// /server/api/product/[id].delete.js
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
  
  // Check if product exists
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found'
    })
  }
  
  // Check if product has orders
  const orders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE product_id = ?').get(id)
  if (orders.count > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cannot delete product with existing orders'
    })
  }
  
  // Delete product
  db.prepare('DELETE FROM products WHERE id = ?').run(id)
  
  return { success: true, message: 'Product deleted successfully' }
})
