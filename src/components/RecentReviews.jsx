import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../util/api';
import styles from './RecentReviews.module.css';

const RecentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/movies/reviews/latest`,
          { params: { amount: 5 } }
        );

        const latestReviews = response.data;

        const movies = await Promise.all(
          [...new Set(latestReviews.map((review) => review.movie_id))].map(
            async (movieId) => {
              try {
                const result = await api.get(
                  `${import.meta.env.VITE_API_URL}/movies/${movieId}`
                );
                return [movieId, result.data];
              } catch {
                return [movieId, null];
              }
            }
          )
        );

        const movieMap = new Map(movies);

        setReviews(
          latestReviews.map((review) => ({
            ...review,
            movie: movieMap.get(review.movie_id),
          }))
        );
      } catch (err) {
        setError(
          err.response?.data?.error?.message || 'Could not load recent reviews.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>Recent reviews</h2>
          <p>See what the MovieNight community thinks.</p>
        </div>

        <Link to="/search" className={styles.moreLink}>
          Discover movies →
        </Link>
      </div>

      {loading && <p className={styles.message}>Loading reviews...</p>}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className={styles.message}>
          No reviews yet. Be the first to share your thoughts!
        </p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className={styles.reviewList}>
          {reviews.map((review) => (
            <article
              key={`${review.movie_id}-${review.account_id}`}
              className={styles.review}
            >
              <div className={styles.movieInfo}>
                <Link
                  to={`/movie/${review.movie_id}`}
                  className={styles.movieTitle}
                >
                  {review.movie?.title || `Movie #${review.movie_id}`}
                </Link>

                <span className={styles.reviewer}>
                  By {review.email.split('@')[0]}
                </span>

                <span className={styles.date}>
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className={styles.rating}>
                <span aria-label={`${review.rating} out of 5 stars`}>
                  {'★'.repeat(Number(review.rating))}
                  {'☆'.repeat(5 - Number(review.rating))}
                </span>
                <strong>{Number(review.rating).toFixed(1)} / 5</strong>
              </div>

              {review.text && (
                <p className={styles.reviewText}>{review.text}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentReviews;
