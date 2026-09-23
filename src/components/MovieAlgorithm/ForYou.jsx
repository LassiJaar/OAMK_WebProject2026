import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from '../NowPlaying.module.css';
import MovieCard from '../MovieCard';
import { calculateSR, randomizeSR } from './srHandler'

const ForYou = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const listRef = useRef(null);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/movies/recommendations`
        );

        const moviePool = (Array.isArray(response.data) ? response.data : []);

        const savedPrefs = sessionStorage.getItem('user_preferences');
        const preferences = savedPrefs ? JSON.parse(savedPrefs) : null;

        const processedMovies = moviePool.map((movie) => {
          const rawSr = calculateSR(movie, preferences);
          return {
            ...movie,
            sr: randomizeSR(rawSr, 0.05)
          };
        });

        const sortedMovies = processedMovies.sort((a, b) => b.sr - a.sr);
        setMovies(sortedMovies);

      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.message ||
            'Could not load recommended movies.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  const scroll = (direction) => {
    if (!listRef.current) return;

    listRef.current.scrollBy({
      left: direction * listRef.current.clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  return (
    <section className={styles.section} aria-labelledby="for-you-title">
      <h2 id="for-you-title">These Might Interest You</h2>

      {loading && <p className={styles.message}>Loading movies...</p>}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!loading && !error && movies.length === 0 && (
        <p className={styles.message}>
          No movies suited for you were found. Try reviewing more movies.
        </p>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className={styles.carousel}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scroll(-1)}
            aria-label="Show previous movies"
          >
            ‹
          </button>

          <div className={styles.movies} ref={listRef}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <button
            type="button"
            className={styles.arrow}
            onClick={() => scroll(1)}
            aria-label="Show more movies"
          >
            ›
          </button>
        </div>
      )}

      <p className={styles.attribution}>Movie data provided by TMDB.</p>
    </section>
  );
};

export default ForYou;
