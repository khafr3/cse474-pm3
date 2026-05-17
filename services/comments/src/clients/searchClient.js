const axios = require('axios');
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL || 'http://localhost:4001';
const updateSearchIndex = async (file_id, comment_text) => {
  try {
    await axios.post(`${SEARCH_SERVICE_URL}/index/comment`, { file_id, comment_text });
    console.log(`Search index updated for file ${file_id}`);
  } catch (err) {
    console.error(`Failed to update search index: ${err.message}`);
  }
};
module.exports = { updateSearchIndex };
