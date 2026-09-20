import { Link } from 'react-router';
import styles from './Account.module.css';
import { useAccount } from '../context/useAccount';
import api from '../util/api';

const Account = () => {
  const { account, signOut } = useAccount();
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
  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>My account</h1>

      <section className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.profileCard}>
            <h1>My profile</h1>
            <p>Image here</p>
            <p>Username</p>
            <p className={styles.p1}>Member since 00.00.0000</p>
            <p className={styles.p1}>100 reviews * 100 favorites</p>
            <button>Edit profile</button>
          </div>

          <div className={styles.statsCard}>
            <h1>Stats</h1>
            <p className={styles.stat}>Reviews 1</p>
            <p className={styles.stat}>Favorites 1</p>
            <p className={styles.stat}>Groups 1</p>
            <p className={styles.stat}>Followers 1</p>
            <p className={styles.stat}>Following 1</p>
          </div>

          <div className={styles.settingsCard}>
            <h1>Account settings</h1>
            <button>Change password</button>
            <button onClick={signOut}>Sign Out</button>
            <button onClick={deleteAccount} className={styles.deleteBtn}>
              Delete account
            </button>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.reviewCard}>
            <h1>Recent Reviews</h1>
            <p>Review X</p>
            <p>Review X</p>
            <p>Review X</p>
          </div>

          <div className={styles.favoritesCard}>
            <h1>Favorites List</h1>
            <p>Movie1</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Account;
