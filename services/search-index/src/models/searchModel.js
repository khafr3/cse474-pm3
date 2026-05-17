const { pool } = require('../db');
const upsertFileIndex = async (file_id, file_name, comment_text = '') => {
  const existing = await pool.query('SELECT content FROM search_index WHERE file_id = $1', [file_id]);
  let newContent = file_name || '';
  if (existing.rows.length > 0) {
    newContent = existing.rows[0].content + ' ' + comment_text;
  } else {
    newContent = (file_name || '') + ' ' + comment_text;
  }
  await pool.query(
    `INSERT INTO search_index (file_id, file_name, content, last_updated)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (file_id) DO UPDATE SET
       content = EXCLUDED.content,
       last_updated = NOW()`,
    [file_id, file_name, newContent]
  );
};
const searchFiles = async (query) => {
  const result = await pool.query(
    `SELECT file_id, file_name, content
     FROM search_index
     WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)
     ORDER BY last_updated DESC`,
    [query]
  );
  return result.rows;
};
const deleteFileIndex = async (file_id) => {
  await pool.query('DELETE FROM search_index WHERE file_id = $1', [file_id]);
};
module.exports = { upsertFileIndex, searchFiles, deleteFileIndex };
