import {
  deleteReview,
  insertReview,
  selectLatestReviewsByAccount,
  selectReviewsByMovie,
} from '../models/Review.js';

const getLatestReviewsByAccount = async (req, res, next) => {
  const { id } = req.params;
  const amount = req.body?.amount ? req.body?.amount : 5;
  try {
    const result = await selectLatestReviewsByAccount(id, amount);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getReviewsByMovie = async (req, res, next) => {
  const { movie_id } = req.params;
  const amount = req.body?.amount ? req.body?.amount : 5;
  try {
    const result = await selectReviewsByMovie(movie_id, amount);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  const movieId = Number(req.params.movie_id);
  const { rating, text, movieTitle } = req.body;
  const accountId = req.account?.account_id;

  if (!movieId || rating === undefined || !movieTitle || !movieTitle.trim()) {
    const error = new Error('A valid movie id, title, and rating are required');
    error.status = 400;
    return next(error);
  }

  try {
    const result = await insertReview(accountId, movieId, movieTitle.trim(), rating, text);
    
    return res.status(201).json({ 
      success: true, 
      review: result.rows[0] 
    });
  } catch (error) {
    next(error);
  }
};

const removeReview = async (req, res, next) => {
  const { movie_id, account_id } = req.params;
  if (req.account?.account_id != account_id) {
    const error = new Error('You can only delete your own review');
    error.status = 403;
    return next(error);
  }
  try {
    await deleteReview(movie_id, account_id);
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

export {
  getLatestReviewsByAccount,
  getReviewsByMovie,
  createReview,
  removeReview,
};
