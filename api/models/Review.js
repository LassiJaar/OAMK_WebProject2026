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
  const query = `SELECT * FROM review WHERE movie_id = $1 ORDER BY ${sortColumn} ${orderDirection} LIMIT $2`;
  console.log(query, id, amount);
  const result = await pool.query(query, [id, amount]);
  return result;
};

const insertReview = async (movie_id, account_id, rating, text) => {
  const result = await pool.query(
    'INSERT INTO review (movie_id, account_id, rating, text) VALUES ($1, $2, $3, $4) RETURNING *;',
    [movie_id, account_id, rating, text]
  );
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
  insertReview,
  deleteReview,
};
