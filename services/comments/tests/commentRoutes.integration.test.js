// Integration tests - requires real DB or mocked pool
// Uses supertest to hit real HTTP endpoints
jest.mock('../src/db');
jest.mock('../src/clients/searchClient');

const { pool } = require('../src/db');
const { updateSearchIndex } = require('../src/clients/searchClient');
const request = require('supertest');
const app = require('../src/app');

updateSearchIndex.mockResolvedValue();

describe('Comments API - Integration Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  test('1. GET /api/health returns 200 ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('2. POST /api/comments with valid body returns 201', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // initDB CREATE TABLE
      .mockResolvedValueOnce({ rows: [] }) // initDB CREATE INDEX
      .mockResolvedValueOnce({ rows: [{ id: 1, file_id: 1, user_id: 10, text: 'Hello', created_at: new Date() }] });

    const res = await request(app)
      .post('/api/comments')
      .send({ file_id: 1, user_id: 10, text: 'Hello' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('3. POST /api/comments with missing fields returns 400', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ file_id: 1 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('4. GET /api/comments without file_id returns 400', async () => {
    const res = await request(app).get('/api/comments');
    expect(res.status).toBe(400);
  });

  test('5. GET /api/ready returns 200', async () => {
    const res = await request(app).get('/api/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
  });

  test('6. GET /metrics returns prometheus metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('http_requests_total');
  });

  test('7. GET /api-docs returns swagger UI', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
  });
});
