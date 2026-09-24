import {
  deleteClub,
  deleteMovie,
  getAllClubs,
  insertClub,
  insertMovie,
  selectMovies,
  updateClub,
} from '../models/Club.js';

const getClubs = async (req, res, next) => {
  try {
    const result = await getAllClubs();
    res.status(200).json(result.rows || []);
  } catch (error) {
    next(error);
  }
};

const createClub = async (req, res, next) => {
  const account_id = req.account?.account_id;
  const { name, description } = req.body;
  try {
    const result = await insertClub(account_id, name, description);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const removeClub = async (req, res, next) => {
  const club_id = req.params.club_id;
  try {
    await deleteClub(club_id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const putClub = async (req, res, next) => {
  const club_id = req.params.club_id;
  const { name, description } = req.body;
  try {
    const result = await updateClub(club_id, name, description);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getMovies = async (req, res, next) => {
  const club_id = req.params.club_id;
  try {
    const result = await selectMovies(club_id);
    return res.status(200).json(result.rows);
  } catch (error) {
    return next(error);
  }
};

const addMovie = async (req, res, next) => {
  const club_id = req.params.club_id;
  const movie_id = req.params.movie_id;
  try {
    const result = await insertMovie(club_id, movie_id);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
};

const removeMovie = async (req, res, next) => {
  const club_id = req.params.club_id;
  const movie_id = req.params.movie_id;
  try {
    await deleteMovie(club_id, movie_id);
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

export {
  getClubs,
  createClub,
  removeClub,
  putClub,
  getMovies,
  addMovie,
  removeMovie,
};
