// /server/api/orders.post.js
import db, { initError } from '../db'

export default defineEventHandler(async (event) => {
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database not initialized',
      data: initError || 'Database connection failed'
    })
  }

  const { product_id, quantity } = await readBody(event)

  // Check stock
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id)
  if (!product) return { error: 'Product not found' }
  if (product.stock < quantity) return { error: 'Not enough stock' }

  // Reduce stock
  db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(quantity, product_id)

  // Insert order
  const stmt = db.prepare('INSERT INTO orders (product_id, quantity) VALUES (?, ?)')
  const info = stmt.run(product_id, quantity)

  return { id: info.lastInsertRowid, product_id, quantity }
})
