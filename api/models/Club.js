import { pool } from './db.js';

const getAllClubs = async () => {
  const result = await pool.query('SELECT * FROM club;');
  return result;
};

const insertClub = async (account_id, name, description) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const clubResult = await client.query(
      'INSERT INTO club (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    await client.query(
      'INSERT INTO club_account (club_id, account_id, role) VALUES ($1, $2, $3) RETURNING *',
      [clubResult.rows[0].club_id, account_id, 'owner']
    );
    await client.query('COMMIT');
    return clubResult;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const updateClub = async (club_id, name, description) => {
  const result = await pool.query(
    'UPDATE club SET name = $2, description = $3 WHERE club_id = $1 RETURNING *;',
    [club_id, name, description]
  );
  return result;
};

const deleteClub = async (club_id) => {
  const result = await pool.query('DELETE FROM club WHERE club_id = $1', [
    club_id,
  ]);
  return result;
};

const selectMovies = async (club_id) => {
  const result = await pool.query(
    'SELECT * FROM club_movie WHERE club_id = $1;',
    [club_id]
  );
  return result;
};

const insertMovie = async (club_id, movie_id) => {
  const result = await pool.query(
    'INSERT INTO club_movie (club_id, movie_id) VALUES ($1, $2) RETURNING *',
    [club_id, movie_id]
  );
  return result;
};

const deleteMovie = async (club_id, movie_id) => {
  const result = await pool.query(
    'DELETE FROM club_movie WHERE club_id = $1 AND movie_id = $2;',
    [club_id, movie_id]
  );
  return result;
};

export {
  getAllClubs,
  insertClub,
  updateClub,
  deleteClub,
  selectMovies,
  insertMovie,
  deleteMovie,
};
