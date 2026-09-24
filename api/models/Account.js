import { pool } from './db.js';

const getAccountByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM account WHERE email = $1', [
    email,
  ]);
  return result;
};

const getAccountById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM account WHERE account_id = $1',
    [id]
  );
  return result;
};

const insertAccount = async (email, password) => {
  const defaultPrefs = JSON.stringify({
    Action28: 0.5,
    Adventure12: 0.5,
    Animation16: 0.5,
    Comedy35: 0.5,
    Crime80: 0.5,
    Documentary99: 0.5,
    Drama18: 0.5,
    Family10751: 0.5,
    Fantasy14: 0.5,
    History36: 0.5,
    Horror27: 0.5,
    Music10402: 0.5,
    Mystery9648: 0.5,
    Romance10749: 0.5,
    SciFi878: 0.5,
    TV10770: 0.5,
    Thriller53: 0.5,
    War10752: 0.5,
    Western37: 0.5,
  });

  const result = await pool.query(
    'INSERT INTO account (email, password, preferences) VALUES (\$1, \$2, \$3) RETURNING account_id, email',
    [email, password, defaultPrefs]
  );
  return result;
};

const updateAccountPreferences = async (id, jsonTarget, alpha) => {
  const query = `
    UPDATE account
    SET preferences = (
      SELECT jsonb_object_agg(
        key, 
        LEAST(1.0, GREATEST(0.0, 
          ROUND(
            CASE 
              WHEN $2::jsonb->>key IS NULL THEN value::numeric
              ELSE ((1.0 - $3::numeric) * value::numeric + $3::numeric * ($2::jsonb->>key)::numeric)
            END
          , 2)
        ))
      )
      FROM jsonb_each(account.preferences)
    )
    WHERE account_id = $1
    RETURNING preferences;
  `;

  const result = await pool.query(query, [id, jsonTarget, alpha]);
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

const updatePassword = async (id, password) => {
  const result = await pool.query(
    'UPDATE account SET password = $1 WHERE account_id = $2',
    [password, id]
  );
  return result;
};

export {
  getAccountByEmail,
  getAccountById,
  insertAccount,
  deleteAccount,
  selectAccountStatistics,
  updatePassword,
  updateAccountPreferences,
};
