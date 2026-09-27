import {
  addFavorite,
  deleteFavorite,
  getFavoritesByAccount,
  isFavorite,
} from '../models/Favorite.js';
import { getAccountById } from '../models/Account.js';
import { getMovieById } from '../models/Movie.js';

const getFavorites = async (req, res, next) => {
  const accountId = Number(req.params.id);

  if (!Number.isInteger(accountId) || accountId <= 0) {
    const error = new Error('A valid account id is required');
    error.status = 400;
    return next(error);
  }

  try {
    const accountResult = await getAccountById(accountId);
    const account = accountResult.rows[0];

    if (!account) {
      const error = new Error('Account not found');
      error.status = 404;
      return next(error);
    }

    const username = account.email.split('@')[0];

    const favorites = await getFavoritesByAccount(accountId);

    const movies = await Promise.all(
      favorites.map(async (favorite) => {
        const movie = await getMovieById(favorite.movie_id);

        return {
          ...movie,
          addedAt: favorite.created_at,
        };
      })
    );

    return res.status(200).json({
      username,
      movies,
    });
  } catch (error) {
    return next(error);
  }
};

const createFavorite = async (req, res, next) => {
  const movieId = Number(req.params.movie_id);
  const accountId = req.account?.account_id;

  if (!Number.isInteger(movieId) || movieId <= 0) {
    const error = new Error('A valid movie id is required');
    error.status = 400;
    return next(error);
  }

  try {
    const result = await addFavorite(movieId, accountId);

    return res.status(201).json({
      success: true,
      favorite: result.rows[0] ?? {
        movie_id: movieId,
        account_id: accountId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  const movieId = Number(req.params.movie_id);
  const accountId = req.account?.account_id;

  if (!Number.isInteger(movieId) || movieId <= 0) {
    const error = new Error('A valid movie id is required');
    error.status = 400;
    return next(error);
  }

  try {
    await deleteFavorite(movieId, accountId);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

const checkFavorite = async (req, res, next) => {
  const movieId = Number(req.params.movie_id);
  const accountId = req.account?.account_id;

  if (!Number.isInteger(movieId) || movieId <= 0) {
    const error = new Error('A valid movie id is required');
    error.status = 400;
    return next(error);
  }

  try {
    const favorite = await isFavorite(movieId, accountId);

    return res.status(200).json({ favorite });
  } catch (error) {
    return next(error);
  }
};

export { getFavorites, createFavorite, removeFavorite, checkFavorite };
