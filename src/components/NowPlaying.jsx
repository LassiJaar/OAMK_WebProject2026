import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./NowPlaying.module.css";
import MovieCard from "./MovieCard";

const NowPlaying = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const listRef = useRef(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/movies/now-playing`,
        );

        setMovies(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.message ||
            "Could not load movies currently in cinemas.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
  }, []);

  const scroll = (direction) => {
    if (!listRef.current) return;

    listRef.current.scrollBy({
      left: direction * listRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.section} aria-labelledby="now-playing-title">
      <div className={styles.headingRow}>
        <h2 id="now-playing-title">Now Playing</h2>

        {!loading && !error && movies.length > 0 && (
          <div className={styles.controls}>
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Show previous movies"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Show more movies"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {loading && <p className={styles.message}>Loading movies...</p>}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!loading && !error && movies.length === 0 && (
        <p className={styles.message}>
          No movies currently in cinemas were found.
        </p>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className={styles.movies} ref={listRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <p className={styles.attribution}>Movie data provided by TMDB.</p>
    </section>
  );
};

export default NowPlaying;
