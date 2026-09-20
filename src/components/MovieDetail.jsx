import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './MovieDetail.module.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/movies/${id}`
        );
        setMovie(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.message ||
            'Could not load movie details.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <p className={styles.message}>Loading movie details...</p>;
  }

  if (error || !movie) {
    return (
      <section className={styles.message}>
        <p className={styles.error} role="alert">
          {error || 'Movie not found.'}
        </p>
        <button type="button" onClick={() => navigate(-1)}>
          Go back
        </button>
      </section>
    );
  }

  const releaseYear = movie.releaseDate?.slice(0, 4);

  return (
    <article className={styles.page}>
      {movie.backdropPath && (
        <div
          className={styles.backdrop}
          style={{ backgroundImage: `url(${BACKDROP_BASE_URL}${movie.backdropPath})` }}
          aria-hidden="true"
        />
      )}

      <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
        Back to results
      </button>

      <div className={styles.content}>
        <div className={styles.posterWrap}>
          {movie.posterPath ? (
            <img
              className={styles.poster}
              src={`${IMAGE_BASE_URL}${movie.posterPath}`}
              alt={`${movie.title} poster`}
            />
          ) : (
            <div className={styles.noPoster}>No poster available</div>
          )}
        </div>

        <div className={styles.details}>
          <p className={styles.eyebrow}>Movie details</p>
          <h1>{movie.title}</h1>
          {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}

          <div className={styles.meta}>
            {releaseYear && <span>{releaseYear}</span>}
            {movie.runtime > 0 && <span>{movie.runtime} min</span>}
            {movie.rating > 0 && <span>★ {movie.rating.toFixed(1)} / 10</span>}
          </div>

          {movie.genres?.length > 0 && (
            <div className={styles.genres}>
              {movie.genres.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}
            </div>
          )}

          <h2>Overview</h2>
          <p className={styles.overview}>
            {movie.overview || 'No overview is available for this movie.'}
          </p>

          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className={styles.originalTitle}>
              Original title: <strong>{movie.originalTitle}</strong>
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default MovieDetail;
