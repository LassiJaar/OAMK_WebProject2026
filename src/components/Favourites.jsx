import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAccount } from '../context/useAccount';
import api from '../util/api';
import styles from './Favourites.module.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const Favourites = () => {
  const { id } = useParams();
  const { account } = useAccount();

  const [username, setUsername] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const ownList = Number(account?.account_id) === Number(id);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/movies/accounts/${id}/favorites`
      );

      setUsername(response.data.username);
      setMovies(response.data.movies);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Could not load favourites.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, [id]);

  const handleRemove = async (movieId) => {
    try {
      await api.delete(
        `${import.meta.env.VITE_API_URL}/movies/${movieId}/favorite`
      );

      setMovies((currentMovies) =>
        currentMovies.filter((movie) => movie.id !== movieId)
      );
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          'Could not remove movie from favourites.'
      );
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage('Link copied!');
    } catch {
      setShareMessage('Could not copy link.');
    }
  };

  if (loading) {
    return <p>Loading favourites...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section className={styles.page}>
      <h1>{ownList ? 'My' : username + "'s"} favourites list</h1>

      <div className={styles.actions}>
        <button type="button" onClick={handleShare}>
          Share
        </button>

        <button type="button">Sort ▼</button>

        <button type="button">Filter</button>

        {shareMessage && <span>{shareMessage}</span>}
      </div>

      <div className={styles.list}>
        {movies.length === 0 ? (
          <p className={styles.empty}>This favourites list is empty.</p>
        ) : (
          movies.map((movie, index) => {
            const releaseYear = movie.releaseDate?.slice(0, 4);

            return (
              <article key={movie.id} className={styles.item}>
                <span className={styles.number}>{index + 1}</span>

                <img
                  src={
                    movie.posterPath
                      ? `${IMAGE_BASE_URL}${movie.posterPath}`
                      : undefined
                  }
                  alt={`${movie.title} poster`}
                  className={styles.poster}
                />

                <div className={styles.info}>
                  <h2>{movie.title}</h2>

                  {releaseYear && <p>{releaseYear}</p>}
                </div>

                {ownList && (
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => handleRemove(movie.id)}
                    aria-label={`Remove ${movie.title} from favourites`}
                  >
                    X
                  </button>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Favourites;
