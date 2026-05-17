// Unit tests for comment controller - mocks DB and searchClient
jest.mock('../src/models/commentModel');
jest.mock('../src/clients/searchClient');

const { createComment, getCommentsByFile } = require('../src/models/commentModel');
const { updateSearchIndex } = require('../src/clients/searchClient');
const { addComment, getComments } = require('../src/controllers/commentController');

const mockReq = (body = {}, query = {}) => ({ body, query, id: 'test-req-id' });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('addComment - unit tests', () => {
  beforeEach(() => jest.clearAllMocks());

  test('1. Happy path: creates comment and calls searchClient', async () => {
    createComment.mockResolvedValue({ id: 1, file_id: 1, user_id: 10, text: 'Hello' });
    updateSearchIndex.mockResolvedValue();
    const req = mockReq({ file_id: 1, user_id: 10, text: 'Hello' });
    const res = mockRes();
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(updateSearchIndex).toHaveBeenCalledWith(1, 'Hello');
  });

  test('2. Missing file_id returns 400', async () => {
    const req = mockReq({ user_id: 10, text: 'Hello' });
    const res = mockRes();
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('3. Missing user_id returns 400', async () => {
    const req = mockReq({ file_id: 1, text: 'Hello' });
    const res = mockRes();
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('4. Missing text returns 400', async () => {
    const req = mockReq({ file_id: 1, user_id: 10 });
    const res = mockRes();
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('5. DB error returns 500', async () => {
    createComment.mockRejectedValue(new Error('DB down'));
    const req = mockReq({ file_id: 1, user_id: 10, text: 'Hello' });
    const res = mockRes();
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('6. Search index failure does NOT fail the comment creation', async () => {
    createComment.mockResolvedValue({ id: 1, file_id: 1, user_id: 10, text: 'Hello' });
    updateSearchIndex.mockRejectedValue(new Error('Search down'));
    const req = mockReq({ file_id: 1, user_id: 10, text: 'Hello' });
    const res = mockRes();
    await addComment(req, res);
    // Should still return 201 because searchClient errors are swallowed
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('getComments - unit tests', () => {
  beforeEach(() => jest.clearAllMocks());

  test('7. Happy path: returns list of comments', async () => {
    getCommentsByFile.mockResolvedValue([{ id: 1, text: 'hi' }]);
    const req = mockReq({}, { file_id: '1' });
    const res = mockRes();
    await getComments(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('8. Missing file_id query param returns 400', async () => {
    const req = mockReq({}, {});
    const res = mockRes();
    await getComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('9. Returns empty array when no comments exist', async () => {
    getCommentsByFile.mockResolvedValue([]);
    const req = mockReq({}, { file_id: '99' });
    const res = mockRes();
    await getComments(req, res);
    const call = res.json.mock.calls[0][0];
    expect(call.data).toEqual([]);
  });

  test('10. DB error on getComments returns 500', async () => {
    getCommentsByFile.mockRejectedValue(new Error('Connection refused'));
    const req = mockReq({}, { file_id: '1' });
    const res = mockRes();
    await getComments(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
