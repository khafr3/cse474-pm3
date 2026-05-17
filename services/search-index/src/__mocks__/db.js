const pool = {
  query: jest.fn().mockResolvedValue({ rows: [] })
};
const initSearchDB = jest.fn().mockResolvedValue();
module.exports = { pool, initSearchDB };
