import { Link } from 'react-router';
import styles from './Account.module.css';
import { useAccount } from '../context/useAccount';
import api from '../util/api';
import { useEffect, useState } from 'react';
import AccountReview from './AccountReview';
import ChangePassword from './ChangePassword';
import Modal from './Modal';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const Account = () => {
  const [passwordModal, setPasswordModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { account, signOut } = useAccount();

  const fetchData = async () => {
    if (!account || !account.account_id) {
      setError('User session not found. Please log in again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/accounts/${account.account_id}`
      );

      const reviewResult = await api.get(
        `${import.meta.env.VITE_API_URL}/movies/accounts/${account.account_id}/reviews`
      );

      console.log(reviewResult.data);

      const favoriteResult = await api.get(
        `${import.meta.env.VITE_API_URL}/movies/accounts/${account.account_id}/favorites`
      );

      setStats(response.data);

      const reviews = Array.isArray(reviewResult.data) ? reviewResult.data : [];

      const reviewsWithMovies = await Promise.all(
        reviews.map(async (review) => {
          try {
            const movieResult = await api.get(
              `${import.meta.env.VITE_API_URL}/movies/${review.movie_id}`
            );

            return {
              ...review,
              movieTitle: movieResult.data.title,
            };
          } catch {
            return review;
          }
        })
      );

      setRecentReviews(reviewsWithMovies);

      setFavoriteMovies(
        Array.isArray(favoriteResult.data.movies)
          ? favoriteResult.data.movies.slice(0, 4)
          : []
      );
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (
      confirm('Are you sure? Account deletion is final and cannot be undone.')
    ) {
      await api.delete(
        `${import.meta.env.VITE_API_URL}/accounts/${account.account_id}`
      );
      await signOut();
    }
  };

  useEffect(() => {
    if (account?.account_id) {
      fetchData();
    }
  }, [account]);

  if (loading) {
    return <div className={styles.message}>Loading account details...</div>;
  }

  if (error || !stats) {
    return (
      <div className={styles.message}>
        <p className={styles.error}>
          Error loading profile: {error || 'No data available'}
        </p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  const releaseDateStr = stats.created_at ? stats.created_at.slice(0, 10) : '';

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>My account</h1>
      <section className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.profileCard}>
            <h1>My profile</h1>

            <div className={styles.username}>
              <span className={styles.label}>Username</span>
              <strong>{account.email.split('@')[0]}</strong>
            </div>

            <p className={styles.p1}>Member since {releaseDateStr}</p>

            <p className={styles.p1}>
              {stats.total_reviews} reviews · {stats.total_favorites} favorites
            </p>
          </div>

          <div className={styles.statsCard}>
            <h1>Stats</h1>
            <p className={styles.stat}>Reviews {stats.total_reviews}</p>
            <p className={styles.stat}>Favorites {stats.total_favorites}</p>
            <p className={styles.stat}>Clubs {stats.total_clubs}</p>
          </div>

          <div className={styles.settingsCard}>
            <h1>Account settings</h1>
            <button onClick={() => setPasswordModal(true)}>
              Change password
            </button>
            {passwordModal && (
              <Modal setModal={setPasswordModal}>
                <ChangePassword></ChangePassword>
              </Modal>
            )}
            <button onClick={signOut}>Sign Out</button>
            <button onClick={deleteAccount} className={styles.deleteBtn}>
              Delete account
            </button>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.reviewCard}>
            <div className={styles.cardHeader}>
              <h1>Recent Reviews</h1>
            </div>

            {recentReviews.length > 0 ? (
              <div className={styles.reviewList}>
                {recentReviews.map((r) => (
                  <div key={r.movie_id} className={styles.reviewItem}>
                    <AccountReview review={r} />
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No reviews yet.</p>
            )}
          </div>

          <div className={styles.favoritesCard}>
            <div className={styles.cardHeader}>
              <h1>Favorites</h1>

              <Link to={`/favourites/${account.account_id}`}>View all</Link>
            </div>

            {favoriteMovies.length > 0 ? (
              <div className={styles.favoritePreview}>
                {favoriteMovies.map((movie) => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className={styles.favoriteMovie}
                  >
                    {movie.posterPath ? (
                      <img
                        src={`${IMAGE_BASE_URL}${movie.posterPath}`}
                        alt={`${movie.title} poster`}
                      />
                    ) : (
                      <div className={styles.noPoster}>No poster</div>
                    )}

                    <span>{movie.title}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>
                You haven't added any movies to your favourites yet.
              </p>
            )}

            {favoriteMovies.length > 0 && (
              <Link
                to={`/favourites/${account.account_id}`}
                className={styles.viewAll}
              >
                View all {stats.total_favorites} favourites →
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Account;
