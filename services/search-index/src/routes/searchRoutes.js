const express = require('express');
const { search, addCommentToIndex, fullIndexFile } = require('../controllers/searchController');
const router = express.Router();

/**
 * @openapi
 * /api/search:
 *   get:
 *     summary: Search files by text
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Search results
 * /api/index/comment:
 *   post:
 *     summary: Add comment text to search index
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [file_id, comment_text]
 *             properties:
 *               file_id: { type: integer }
 *               comment_text: { type: string }
 *     responses:
 *       200:
 *         description: Index updated
 * /api/index/file:
 *   post:
 *     summary: Index a file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [file_id, file_name]
 *             properties:
 *               file_id: { type: integer }
 *               file_name: { type: string }
 *     responses:
 *       200:
 *         description: File indexed
 * /api/health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: ok
 * /api/ready:
 *   get:
 *     summary: Readiness check
 *     responses:
 *       200:
 *         description: ready
 */
router.get('/search', search);
router.post('/index/comment', addCommentToIndex);
router.post('/index/file', fullIndexFile);
router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.get('/ready', (req, res) => res.json({ status: 'ready' }));
module.exports = router;
