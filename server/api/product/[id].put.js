// /server/api/product/[id].put.js
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
  const body = await readBody(event)
  
  const { name, price, stock } = body
  
  // Validate input
  if (!name || price === undefined || stock === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name, price, stock'
    })
  }
  
  // Check if product exists
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found'
    })
  }
  
  // Update product
  db.prepare('UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?').run(name, price, stock, id)
  
  // Return updated product
  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  return updated
})
