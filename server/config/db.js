const mysql = require('mysql2/promise');
// Ensure env vars are loaded for scripts that import db directly (e.g. create-admin.js)
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function ensureProductsSchema(connection) {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS total
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ?
       AND TABLE_NAME = 'products'
       AND COLUMN_NAME = 'ask_for_price'`,
    [process.env.DB_NAME]
  );

  if (rows[0]?.total === 0) {
    await connection.execute(
      'ALTER TABLE products ADD COLUMN ask_for_price TINYINT(1) DEFAULT 0 AFTER is_customizable'
    );
    console.log('Added missing products.ask_for_price column automatically.');
  }
}

// Retry DB connection on startup if it fails
async function testDbConnectionWithRetry(retryDelay = 5000) {
  while (true) {
    let conn;
    try {
      conn = await pool.getConnection();
      console.log('MySQL database connected successfully!');
      await ensureProductsSchema(conn);
      break;
    } catch (err) {
      console.error('MySQL database connection failed:', err.message);
      console.log(`Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, retryDelay));
    } finally {
      if (conn) conn.release();
    }
  }
}

testDbConnectionWithRetry();

module.exports = pool;
