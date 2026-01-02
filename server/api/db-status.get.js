// /server/api/db-status.get.js
import db, { initError } from '../db.js'

export default defineEventHandler(() => {
  let status = 'unknown';
  let error = initError || null;
  
  if (db) {
    try {
      // Try to execute a simple query
      db.prepare('SELECT 1').get();
      status = 'connected';
      error = null;
    } catch (queryError) {
      status = 'query_failed';
      error = queryError.message;
    }
  } else {
    status = 'null';
    error = error || 'Database object is null';
  }
  
  return {
    status,
    error,
    env: {
      DB_PATH: process.env.DB_PATH || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    }
  };
});
