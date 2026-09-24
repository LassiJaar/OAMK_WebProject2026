import { pool } from './db.js';

const selectClubAccount = async (club_id) => {
  const result = await pool.query(
    'SELECT * FROM club_account WHERE club_id = $1;',
    [club_id]
  );
  return result;
};

const insertClubAccount = async (account_id, club_id, role = 'pending') => {
  const result = await pool.query(
    'INSERT INTO club_account (account_id, club_id, role) VALUES ($1, $2, $3) RETURNING *;',
    [account_id, club_id, role]
  );
  return result;
};

const updateRole = async (account_id, club_id, role) => {
  const result = await pool.query(
    'UPDATE club_account SET role = $3 WHERE account_id = $1 AND club_id = $2 RETURNING *;',
    [account_id, club_id, role]
  );
  if (result.rowCount === 0) {
    const error = new Error('Account not found in club');
    error.status = 404;
    throw error;
  }
  return result;
};

const deleteClubAccount = async (account_id, club_id) => {
  const result = await pool.query(
    'DELETE FROM club_account WHERE account_id = $1 AND club_id = $2;',
    [account_id, club_id]
  );
  return result;
};

export { selectClubAccount, insertClubAccount, updateRole, deleteClubAccount };
