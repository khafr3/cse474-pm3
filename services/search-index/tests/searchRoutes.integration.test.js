jest.mock('../src/db');
jest.mock('../src/kafkaConsumer');

const { startConsumer } = require('../src/kafkaConsumer');
startConsumer.mockResolvedValue();

const { pool } = require('../src/db');
const request = require('supertest');
const app = require('../src/app');

describe('Search Index API - Integration Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  test('1. GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('2. GET /api/ready returns 200', async () => {
    const res = await request(app).get('/api/ready');
    expect(res.status).toBe(200);
  });

  test('3. GET /api/search without q returns 400', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
  });

  test('4. POST /api/index/comment with valid data returns 200', async () => {
    pool.query.mockResolvedValue({ rows: [{ content: '' }] });
    const res = await request(app)
      .post('/api/index/comment')
      .send({ file_id: 1, comment_text: 'hello world' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('5. POST /api/index/comment missing data returns 400', async () => {
    const res = await request(app)
      .post('/api/index/comment')
      .send({ file_id: 1 });
    expect(res.status).toBe(400);
  });

  test('6. GET /metrics returns prometheus format', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('http_requests_total');
  });

  test('7. GET /api-docs/ returns swagger UI', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
  });
});
