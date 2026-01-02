// /server/api/reports.get.js
import db, { initError } from '../db'

export default defineEventHandler(() => {
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database not initialized',
      data: initError || 'Database connection failed'
    })
  }

  // Total revenue
  const revenueResult = db.prepare(`
    SELECT SUM(o.quantity * p.price) as total
    FROM orders o
    LEFT JOIN products p ON o.product_id = p.id
  `).get()
  const totalRevenue = revenueResult?.total || 0

  // Total orders
  const ordersResult = db.prepare('SELECT COUNT(*) as count FROM orders').get()
  const totalOrders = ordersResult?.count || 0

  // Total products
  const productsResult = db.prepare('SELECT COUNT(*) as count FROM products').get()
  const totalProducts = productsResult?.count || 0

  // Average order value
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Top products
  const topProducts = db.prepare(`
    SELECT 
      o.product_id,
      p.name as product_name,
      SUM(o.quantity) as total_quantity,
      SUM(o.quantity * p.price) as total_revenue
    FROM orders o
    LEFT JOIN products p ON o.product_id = p.id
    GROUP BY o.product_id, p.name
    ORDER BY total_revenue DESC
    LIMIT 10
  `).all()

  // Sales by date
  const salesByDateRaw = db.prepare(`
    SELECT 
      DATE(o.created_at) as date,
      COUNT(*) as orders,
      SUM(o.quantity * p.price) as revenue
    FROM orders o
    LEFT JOIN products p ON o.product_id = p.id
    GROUP BY DATE(o.created_at)
    ORDER BY date DESC
  `).all()

  const salesByDate = {}
  salesByDateRaw.forEach(row => {
    salesByDate[row.date] = {
      orders: row.orders,
      revenue: row.revenue || 0
    }
  })

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    avgOrderValue,
    topProducts,
    salesByDate
  }
})
