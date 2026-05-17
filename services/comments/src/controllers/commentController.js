const { createComment, getCommentsByFile } = require('../models/commentModel');
const { updateSearchIndex } = require('../clients/searchClient');

const addComment = async (req, res) => {
  const { file_id, user_id, text } = req.body;
  if (!file_id || !user_id || !text) {
    return res.status(400).json({
      success: false,
      error: { code: 'MISSING_FIELDS', message: 'file_id, user_id, text required' },
      meta: { service: 'comments', request_id: req.id }
    });
  }
  try {
    const comment = await createComment(file_id, user_id, text);
    // Fire and forget - search index errors must NOT fail comment creation
    updateSearchIndex(file_id, text).catch((err) => {
      console.error(`Search index update failed: ${err.message}`);
    });
    res.status(201).json({ success: true, data: comment, meta: { service: 'comments', request_id: req.id } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message }, meta: { service: 'comments', request_id: req.id } });
  }
};

const getComments = async (req, res) => {
  const { file_id } = req.query;
  if (!file_id) {
    return res.status(400).json({ success: false, error: { code: 'MISSING_FILE_ID', message: 'file_id query param required' } });
  }
  try {
    const comments = await getCommentsByFile(parseInt(file_id));
    res.json({ success: true, data: comments, meta: { service: 'comments', request_id: req.id } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
};

module.exports = { addComment, getComments };
