// /server/api/product.get.js
import db, { initError } from '../db'

export default defineEventHandler(() => {
  try {
    console.log('GET /api/product - Handler called');
    console.log('Database object:', db ? 'exists' : 'null/undefined');
    
    if (!db) {
      const errorMsg = initError || 'Database not initialized. Check server logs for database initialization errors.';
      console.error(errorMsg);
      throw createError({
        statusCode: 500,
        statusMessage: 'Database not initialized',
        data: errorMsg
      });
    }
    
    console.log('Executing query...');
    const products = db.prepare('SELECT * FROM products').all();
    console.log('Query executed successfully, products count:', products.length);
    return products;
  } catch (error) {
    console.error('Error fetching products:');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch products',
      data: {
        error: error?.toString(),
        stack: error?.stack
      }
    });
  }
});
