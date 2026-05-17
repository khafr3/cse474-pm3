const { pool } = require('../db');
const createComment = async (file_id, user_id, text) => {
  const result = await pool.query(
    'INSERT INTO comments (file_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
    [file_id, user_id, text]
  );
  return result.rows[0];
};
const getCommentsByFile = async (file_id) => {
  const result = await pool.query(
    'SELECT * FROM comments WHERE file_id = $1 ORDER BY created_at DESC',
    [file_id]
  );
  return result.rows;
};
module.exports = { createComment, getCommentsByFile };
