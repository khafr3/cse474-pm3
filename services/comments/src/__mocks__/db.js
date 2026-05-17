const pool = {
  query: jest.fn().mockResolvedValue({ rows: [] })
};
const initDB = jest.fn().mockResolvedValue();
module.exports = { pool, initDB };
