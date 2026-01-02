// /server/api/product.post.js
import db, { initError } from '../db'

export default defineEventHandler(async (event) => {
  try {
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database not initialized',
        data: initError || 'Database connection failed'
      })
    }

    const body = await readBody(event)
    const { name, price, stock } = body

    if (!name || price === undefined || stock === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, price, stock'
      })
    }

    const stmt = db.prepare('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)')
    const info = stmt.run(name, price, stock)

    return { id: info.lastInsertRowid, name, price, stock }
  } catch (error) {
    console.error('Error creating product:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create product',
      data: error.message
    })
  }
})
