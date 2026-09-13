import { searchMovies } from '../models/Movie.js';

const getMovies = async (req, res, next) => {
  const { query, genre, minYear, maxYear, rating } = req.query;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: { message: 'A movie search query is required', status: 400 } });
  }

  try {
    const movies = await searchMovies({
      query: query.trim(),
      genre: genre || undefined,
      minYear: minYear || undefined,
      maxYear: maxYear || undefined,
      rating: rating || undefined,
    });
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

export { getMovies };