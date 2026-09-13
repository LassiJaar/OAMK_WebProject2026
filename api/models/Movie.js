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
    const details = await response.text();
    const error = new Error(
      `TMDB request failed with status ${response.status}. ${details}`
    );
    error.status = 502;
    throw error;
  }

  const data = await response.json();

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
