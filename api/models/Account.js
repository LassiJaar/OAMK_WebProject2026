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

const selectAccountStatistics = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      a.account_id,
      a.email,
      a.created_at,
      (SELECT COUNT(*) FROM review r WHERE r.account_id=a.account_id) as total_reviews,
      (SELECT COUNT(*) FROM favorite f WHERE f.account_id=a.account_id) AS total_favorites,
      (SELECT COUNT(*) FROM club_account ca WHERE ca.account_id=a.account_id AND ca.role!='pending') AS total_clubs
    FROM account a
    WHERE a.account_id=$1;`,
    [id]
  );
  return result;
};

export {
  getAccountByEmail,
  insertAccount,
  deleteAccount,
  selectAccountStatistics,
};
