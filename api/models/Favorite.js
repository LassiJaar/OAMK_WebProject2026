import { pool } from './db.js';

const getFavoritesByAccount = async (accountId) => {
  const result = await pool.query(
    `
    SELECT movie_id, created_at
    FROM favorite
    WHERE account_id = $1
    ORDER BY created_at ASC
    `,
    [accountId]
  );

  return result.rows;
};

const addFavorite = async (movieId, accountId) => {
  const result = await pool.query(
    `
    INSERT INTO favorite (movie_id, account_id)
    VALUES ($1, $2)
    ON CONFLICT (movie_id, account_id) DO NOTHING
    RETURNING movie_id, account_id, created_at
    `,
    [movieId, accountId]
  );

  return result;
};

const deleteFavorite = async (movieId, accountId) => {
  const result = await pool.query(
    `
    DELETE FROM favorite
    WHERE movie_id = $1 AND account_id = $2
    `,
    [movieId, accountId]
  );

  return result;
};

const isFavorite = async (movieId, accountId) => {
  const result = await pool.query(
    `
    SELECT 1
    FROM favorite
    WHERE movie_id = $1 AND account_id = $2
    `,
    [movieId, accountId]
  );

  return result.rowCount > 0;
};

export { getFavoritesByAccount, addFavorite, deleteFavorite, isFavorite };
