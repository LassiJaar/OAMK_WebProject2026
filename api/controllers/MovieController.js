import { getNowPlayingMovies } from '../models/Movie.js';

const getNowPlaying = async (req, res, next) => {
  try {
    const movies = await getNowPlayingMovies();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

export { getNowPlaying };
