const express = require('express');
const { addComment, getComments } = require('../controllers/commentController');
const router = express.Router();

/**
 * @openapi
 * /api/comments:
 *   post:
 *     summary: Add a comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [file_id, user_id, text]
 *             properties:
 *               file_id: { type: integer }
 *               user_id: { type: integer }
 *               text: { type: string }
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Missing fields
 *   get:
 *     summary: Get comments for a file
 *     parameters:
 *       - in: query
 *         name: file_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of comments
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
router.post('/comments', addComment);
router.get('/comments', getComments);
router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.get('/ready', (req, res) => res.json({ status: 'ready' }));
module.exports = router;
