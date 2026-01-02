// /server/api/test.get.js
export default defineEventHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      DB_PATH: process.env.DB_PATH || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    }
  }
})
