const { searchFiles, upsertFileIndex } = require('../models/searchModel');

const search = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ success: false, error: { code: 'MISSING_QUERY' } });
  try {
    const results = await searchFiles(q);
    res.json({ success: true, data: results, meta: { service: 'search-index' } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SEARCH_ERROR', message: err.message } });
  }
};

const addCommentToIndex = async (req, res) => {
  const { file_id, comment_text } = req.body;
  if (!file_id || !comment_text) {
    return res.status(400).json({ success: false, error: { code: 'MISSING_DATA' } });
  }
  try {
    await upsertFileIndex(file_id, null, comment_text);
    res.json({ success: true, data: { file_id, updated: true } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INDEX_UPDATE_ERROR', message: err.message } });
  }
};

const fullIndexFile = async (req, res) => {
  const { file_id, file_name } = req.body;
  try {
    await upsertFileIndex(file_id, file_name, '');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INDEX_ERROR', message: err.message } });
  }
};

module.exports = { search, addCommentToIndex, fullIndexFile };
