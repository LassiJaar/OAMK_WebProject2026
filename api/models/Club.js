import { pool } from './db.js';

const getAllClubs = async () => {
  const result = await pool.query('SELECT * FROM club;');
  return result;
};

export { getAllClubs };
