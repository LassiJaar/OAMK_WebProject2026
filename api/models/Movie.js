const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const searchMovies = async ({ query, genre, minYear, maxYear, rating }) => {
  const token = process.env.TMDB_TOKEN;

  if (!token) {
    const error = new Error('TMDB_TOKEN is not configured.');
    error.status = 500;
    throw error;
  }

  const params = new URLSearchParams({
    query,
  });

  const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`, {
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
    error.status = response.status >= 500 ? 502 : response.status;
    throw error;
  }

  const data = await response.json();
  return (data.results || [])
    .filter((movie) => {
      const releaseYear = movie.release_date
        ? Number(movie.release_date.slice(0, 4))
        : null;
      const matchesGenre =
        genre === undefined || movie.genre_ids?.includes(Number(genre));
      const matchesMinYear =
        minYear === undefined ||
        (releaseYear !== null && releaseYear >= Number(minYear));
      const matchesMaxYear =
        maxYear === undefined ||
        (releaseYear !== null && releaseYear <= Number(maxYear));
      const matchesRating =
        rating === undefined || movie.vote_average >= Number(rating);

      return matchesGenre && matchesMinYear && matchesMaxYear && matchesRating;
    })
    .map((movie) => ({
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
    error.status = response.status >= 500 ? 502 : response.status;
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

const getMovieById = async (id) => {
  const token = process.env.TMDB_TOKEN;

  if (!token) {
    const error = new Error('TMDB_TOKEN is not configured.');
    error.status = 500;
    throw error;
  }

  const response = await fetch(`${TMDB_BASE_URL}/movie/${id}`, {
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
    error.status = response.status >= 500 ? 502 : response.status;
    throw error;
  }

  const movie = await response.json();
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    overview: movie.overview,
    rating: movie.vote_average,
    runtime: movie.runtime,
    genres: movie.genres?.map((genre) => genre.name) ?? [],
    tagline: movie.tagline,
  };
};

const getRecommendationPool = async () => {
  const token = process.env.TMDB_TOKEN;

  if (!token) {
    const error = new Error('TMDB_TOKEN is not configured.');
    error.status = 500;
    throw error;
  }

  const endpoints = ['popular', 'upcoming', 'top_rated'];

  const fetchPromises = endpoints.map(async (endpoint) => {
    const url = new URL(`${TMDB_BASE_URL}/movie/${endpoint}`);
    url.searchParams.set('language', 'fi-FI');
    url.searchParams.set('page', '1');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.results ?? [];
  });

  const resultsArray = await Promise.all(fetchPromises);
  
  const combinedMovies = resultsArray.flat();

  const uniqueMoviesMap = new Map();
  combinedMovies.forEach((movie) => {
    if (movie && movie.id) {
      uniqueMoviesMap.set(movie.id, movie);
    }
  });

  return Array.from(uniqueMoviesMap.values()).map((movie) => ({
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    overview: movie.overview,
    rating: movie.vote_average,
    genre_ids: movie.genre_ids,
  }));
};

export { searchMovies, getNowPlayingMovies, getMovieById, getRecommendationPool };
