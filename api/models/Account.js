import { pool } from './db.js';

const getAccountByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM account WHERE email = $1', [
    email,
  ]);
  return result;
};

const insertAccount = async (email, password) => {
  const result = await pool.query(
    'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING account_id, email',
    [email, password]
  );
  return result;
};

const deleteAccount = async (id) => {
  const result = await pool.query('DELETE FROM account WHERE account_id = $1', [
    id,
  ]);
  return result;
};

export { getAccountByEmail, insertAccount, deleteAccount };
