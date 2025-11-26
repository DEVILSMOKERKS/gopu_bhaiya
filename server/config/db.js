const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER ,
  password: 'Saanz#123456',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Retry DB connection on startup if it fails
async function testDbConnectionWithRetry(retryDelay = 5000) {
  while (true) {
    try {
      const conn = await pool.getConnection();
      console.log('MySQL database connected successfully!');
      conn.release();
      break;
    } catch (err) {
      console.error('MySQL database connection failed:', err.message);
      console.log(`Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, retryDelay));
    }
  }
}

testDbConnectionWithRetry();

module.exports = pool;
