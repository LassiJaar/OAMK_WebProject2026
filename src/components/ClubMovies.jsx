import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../util/api';
import styles from './ClubMovies.module.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const ClubMovies = ({ clubId, role }) => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const fetchMovies = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/clubs/${clubId}/movies`
      );

      const movieIds = response.data.map((movie) => movie.movie_id);

      const movieResponses = await Promise.all(
        movieIds.map((movieId) =>
          api.get(`${import.meta.env.VITE_API_URL}/movies/${movieId}`)
        )
      );

      setMovies(movieResponses.map((response) => response.data));
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Could not load club movies.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [clubId]);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!search.trim()) {
      setResults([]);
      return;
    }

    try {
      setSearching(true);
      setError('');

      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/movies/search`,
        {
          params: {
            query: search.trim(),
          },
        }
      );

      setResults(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Could not search for movies.'
      );
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (movieId) => {
    try {
      await api.post(
        `${import.meta.env.VITE_API_URL}/clubs/${clubId}/movies/${movieId}`
      );

      await fetchMovies();

      setResults((currentResults) =>
        currentResults.filter((movie) => movie.id !== movieId)
      );
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Could not add movie to club.'
      );
    }
  };

  const handleRemove = async (movieId) => {
    try {
      await api.delete(
        `${import.meta.env.VITE_API_URL}/clubs/${clubId}/movies/${movieId}`
      );

      setMovies((currentMovies) =>
        currentMovies.filter((movie) => movie.id !== movieId)
      );
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          'Could not remove movie from club.'
      );
    }
  };

  const movieAlreadyAdded = (movieId) =>
    movies.some((movie) => movie.id === movieId);

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>Club movies</h2>
          <p>Movies shared by this club.</p>
        </div>

        <span className={styles.count}>{movies.length}</span>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {role === 'owner' || role === 'member' ? (
        <div className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for a movie"
              className={styles.searchInput}
            />

            <button
              type="submit"
              className={styles.searchButton}
              disabled={searching}
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {results.length > 0 && (
            <div className={styles.results}>
              {results.map((movie) => (
                <article key={movie.id} className={styles.result}>
                  {movie.posterPath ? (
                    <img
                      src={`${IMAGE_BASE_URL}${movie.posterPath}`}
                      alt=""
                      className={styles.resultPoster}
                    />
                  ) : (
                    <div className={styles.noPoster}>No poster</div>
                  )}

                  <div className={styles.resultInfo}>
                    <h3>{movie.title}</h3>

                    {movie.releaseDate && (
                      <p>{movie.releaseDate.slice(0, 4)}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => handleAdd(movie.id)}
                    disabled={movieAlreadyAdded(movie.id)}
                  >
                    {movieAlreadyAdded(movie.id) ? 'Added' : 'Add'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {loading ? (
        <p className={styles.message}>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className={styles.message}>
          No movies have been added to this club yet.
        </p>
      ) : (
        <div className={styles.movieGrid}>
          {movies.map((movie) => (
            <article key={movie.id} className={styles.movie}>
              <Link to={`/movie/${movie.id}`}>
                {movie.posterPath ? (
                  <img
                    src={`${IMAGE_BASE_URL}${movie.posterPath}`}
                    alt={`${movie.title} poster`}
                    className={styles.poster}
                  />
                ) : (
                  <div className={styles.noPoster}>No poster</div>
                )}

                <h3>{movie.title}</h3>

                {movie.releaseDate && <p>{movie.releaseDate.slice(0, 4)}</p>}
              </Link>

              {(role === 'owner' || role === 'member') && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(movie.id)}
                >
                  Remove
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ClubMovies;
