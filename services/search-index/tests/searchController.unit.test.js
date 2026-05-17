jest.mock('../src/models/searchModel');

const { searchFiles, upsertFileIndex } = require('../src/models/searchModel');
const { search, addCommentToIndex, fullIndexFile } = require('../src/controllers/searchController');

const mockReq = (body = {}, query = {}) => ({ body, query });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('search controller - unit tests', () => {
  beforeEach(() => jest.clearAllMocks());

  test('1. Happy path search returns results', async () => {
    searchFiles.mockResolvedValue([{ file_id: 1, file_name: 'test.pdf', content: 'hello' }]);
    const req = mockReq({}, { q: 'hello' });
    const res = mockRes();
    await search(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('2. Missing query param q returns 400', async () => {
    const req = mockReq({}, {});
    const res = mockRes();
    await search(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('3. addCommentToIndex happy path', async () => {
    upsertFileIndex.mockResolvedValue();
    const req = mockReq({ file_id: 1, comment_text: 'hello' });
    const res = mockRes();
    await addCommentToIndex(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('4. addCommentToIndex missing data returns 400', async () => {
    const req = mockReq({ file_id: 1 });
    const res = mockRes();
    await addCommentToIndex(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('5. fullIndexFile happy path', async () => {
    upsertFileIndex.mockResolvedValue();
    const req = mockReq({ file_id: 1, file_name: 'doc.pdf' });
    const res = mockRes();
    await fullIndexFile(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('6. search DB error returns 500', async () => {
    searchFiles.mockRejectedValue(new Error('DB error'));
    const req = mockReq({}, { q: 'hello' });
    const res = mockRes();
    await search(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('7. addCommentToIndex DB error returns 500', async () => {
    upsertFileIndex.mockRejectedValue(new Error('DB error'));
    const req = mockReq({ file_id: 1, comment_text: 'hello' });
    const res = mockRes();
    await addCommentToIndex(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('8. search returns empty array when no results', async () => {
    searchFiles.mockResolvedValue([]);
    const req = mockReq({}, { q: 'nonexistent' });
    const res = mockRes();
    await search(req, res);
    const call = res.json.mock.calls[0][0];
    expect(call.data).toEqual([]);
  });

  test('9. upsertFileIndex called with correct args in addCommentToIndex', async () => {
    upsertFileIndex.mockResolvedValue();
    const req = mockReq({ file_id: 5, comment_text: 'test comment' });
    const res = mockRes();
    await addCommentToIndex(req, res);
    expect(upsertFileIndex).toHaveBeenCalledWith(5, null, 'test comment');
  });

  test('10. fullIndexFile calls upsertFileIndex with file data', async () => {
    upsertFileIndex.mockResolvedValue();
    const req = mockReq({ file_id: 3, file_name: 'report.pdf' });
    const res = mockRes();
    await fullIndexFile(req, res);
    expect(upsertFileIndex).toHaveBeenCalledWith(3, 'report.pdf', '');
  });
});
