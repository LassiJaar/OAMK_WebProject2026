import { pool } from './db.js';

const selectLatestReviewsByAccount = async (id, amount) => {
  const result = await pool.query(
    'SELECT * FROM review WHERE account_id = $1 ORDER BY created_at DESC LIMIT $2;',
    [id, amount]
  );
  return result;
};

const selectReviewsByMovie = async (id, amount, sort, order) => {
  const sorts = ['created_at', 'rating'];
  const orders = ['ASC', 'DESC'];
  const sortColumn = sorts.includes(sort) ? sort : 'created_at';
  const orderDirection = orders.includes(order) ? order : 'DESC';
  const limitClause = Number.isInteger(amount) && amount > 0 ? 'LIMIT $2' : '';
  const query = `
    SELECT review.*
    FROM review
    WHERE movie_id = $1
    ORDER BY ${sortColumn} ${orderDirection}
    ${limitClause};
  `;
  const values = limitClause ? [id, amount] : [id];
  const result = await pool.query(query, values);
  return result;
};

const selectMovieReviewSummary = async (id) => {
  const result = await pool.query(
    `
      SELECT
        COALESCE(AVG(rating), 0) AS average_rating,
        COUNT(*)::int AS review_count
      FROM review
      WHERE movie_id = $1;
    `,
    [id]
  );
  return result.rows[0];
};

const insertReview = async (account_id, movie_id, rating, text) => {
  const movieQuery = `
    INSERT INTO movie (movie_id, title, created_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (movie_id) DO NOTHING;
  `;
  await pool.query(movieQuery, [movie_id, movie_title]);

  const query = `
    INSERT INTO review (movie_id, account_id, rating, text)
    VALUES ($2, $1, $3, $4)
    ON CONFLICT (movie_id, account_id)
    DO UPDATE SET rating = $3, text = $4, created_at = NOW()
    RETURNING *;
  `;

  const result = await pool.query(query, [account_id, movie_id, rating, text]);

  return result;
};

const deleteReview = async (movie_id, account_id) => {
  const result = await pool.query(
    'DELETE FROM review WHERE movie_id = $1 AND account_id = $2;',
    [movie_id, account_id]
  );
  return result;
};

export {
  selectLatestReviewsByAccount,
  selectReviewsByMovie,
  selectMovieReviewSummary,
  insertReview,
  deleteReview,
};
