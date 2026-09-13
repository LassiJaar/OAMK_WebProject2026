const TMDB_URL = 'https://api.themoviedb.org/3/search/movie';

const searchMovies = async ({ query, genre, minYear, maxYear, rating }) => {
  const params = new URLSearchParams({
    query
  });

  const response = await fetch(`${TMDB_URL}?${params}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const getNowPlayingMovies = async () => {
  const token = process.env.TMDB_TOKEN;

  if (!token) {
    const error = new Error('TMDB_TOKEN is not configured.');
    error.status = 500;
    throw error;
  }

  const url = new URL(`${TMDB_BASE_URL}/movie/now_playing`);
  url.searchParams.set('language', 'fi-FI');
  url.searchParams.set('region', 'FI');
  url.searchParams.set('page', '1');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('Movie service request failed');
    error.status = response.status >= 500 ? 502 : response.status;
    const details = await response.text();
    const error = new Error(
      `TMDB request failed with status ${response.status}. ${details}`
    );
    error.status = 502;
    throw error;
  }

  const data = await response.json();
  return (data.results || []).filter((movie) => {
    const releaseYear = movie.release_date
      ? Number(movie.release_date.slice(0, 4))
      : null;
    const matchesGenre =
      genre === undefined || movie.genre_ids?.includes(Number(genre));
    const matchesMinYear =
      minYear === undefined || (releaseYear !== null && releaseYear >= Number(minYear));
    const matchesMaxYear =
      maxYear === undefined || (releaseYear !== null && releaseYear <= Number(maxYear));
    const matchesRating =
      rating === undefined || movie.vote_average >= Number(rating);

    return matchesGenre && matchesMinYear && matchesMaxYear && matchesRating;
  });
};

export { searchMovies };

  return (data.results ?? []).map((movie) => ({
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    overview: movie.overview,
    rating: movie.vote_average,
  }));
};

export { getNowPlayingMovies };
