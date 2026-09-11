import { useEffect, useState } from 'react';
import styles from './NowPlaying.module.css';
import axios from 'axios';
import MovieCard from './MovieCard';

const NowPlaying = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}`);
      setMovies(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="titlediv">
        <h1 className={styles.title}>Now Playing</h1>
      </div>
      {loading && <p>Loading...</p>}
      {movies && (
        <div className={styles.movies}>
          {movies.map((m) => (
            <MovieCard key={m.movie_id} movie={m}></MovieCard>
          ))}
          {/* Repeat twice for slider testing, remove second one later. */}
            {movies.map((m) => (
              <MovieCard key={m.movie_id} movie={m}></MovieCard>
            ))}
        </div>
      )}
    </div>
  );
};
export default NowPlaying;
