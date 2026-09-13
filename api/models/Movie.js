const TMDB_URL = 'https://api.themoviedb.org/3/search/movie';

const searchMovies = async ({ query, genre, minYear, maxYear, rating }) => {
  const params = new URLSearchParams({
    query
  });

  const response = await fetch(`${TMDB_URL}?${params}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('Movie service request failed');
    error.status = response.status >= 500 ? 502 : response.status;
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