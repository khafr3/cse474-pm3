const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'search_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const initSearchDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS search_index (
      file_id INTEGER PRIMARY KEY,
      file_name TEXT,
      content TEXT,
      last_updated TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_fts ON search_index USING GIN (to_tsvector('english', content));
  `);
  console.log('Search DB initialized');
};

module.exports = { pool, initSearchDB };