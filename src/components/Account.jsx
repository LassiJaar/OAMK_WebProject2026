import { Link } from 'react-router';
import styles from './Account.module.css';
import { useAccount } from '../context/useAccount';
import api from '../util/api';
import { useEffect, useState } from 'react';
import AccountReview from './AccountReview';
import ChangePassword from './ChangePassword';
import Modal from './Modal';

const Account = () => {
  const [passwordModal, setPasswordModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { account, signOut } = useAccount();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/accounts/${account.account_id}`
      );
      const reviewResult = await api.get(
        `${import.meta.env.VITE_API_URL}/accounts/${account.account_id}/reviews`
      );
      setStats(response.data);
      setRecentReviews(reviewResult.data);
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
    fetchData();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>My account</h1>
      {!loading && (
        <section className={styles.container}>
          <div className={styles.leftColumn}>
            <div className={styles.profileCard}>
              <h1>My profile</h1>
              <p>Image here</p>
              <p>Username</p>
              <p className={styles.p1}>
                Member since {stats.created_at.slice(0, 10)}
              </p>
              <p className={styles.p1}>
                {stats.total_reviews} reviews * {stats.total_favorites}{' '}
                favorites
              </p>
              <button>Edit profile</button>
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
              <h1>Recent Reviews</h1>
              {recentReviews.map((r) => (
                <AccountReview key={r.movie_id} review={r}></AccountReview>
              ))}
            </div>

            <div className={styles.favoritesCard}>
              <h1>Favorites List</h1>
              <p>Movie1</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Account;
