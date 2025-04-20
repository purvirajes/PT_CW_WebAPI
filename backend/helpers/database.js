// helpers/database.js
const mysql = require('promise-mysql');
require('dotenv').config();

// Initialize pool variable
let pool = null;

// Create the pool asynchronously
async function init_pool() {
  pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  return pool;
}

// Run query function to interact with the DB
async function run_query(query, params = []) {
  // Initialize pool if it doesn't exist
  if (pool === null) {
    pool = await init_pool();
  }
  return pool.query(query, params);
}

module.exports = { run_query };
