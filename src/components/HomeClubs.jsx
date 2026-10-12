import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAccount } from '../context/useAccount';
import api from '../util/api';
import ClubsCard from './ClubsCard';
import styles from './HomeClubs.module.css';

const HomeClubs = () => {
  const { account } = useAccount();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = account
        ? await api.get(`${import.meta.env.VITE_API_URL}/clubs/me`, {
            params: { role: 'all' },
          })
        : await api.get(`${import.meta.env.VITE_API_URL}/clubs`);

      setClubs(response.data.slice(0, 3));
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not load clubs.');
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>Movie clubs</h2>
          <p>Find people who love movies as much as you do.</p>
        </div>

        <Link to="/clubs" className={styles.moreLink}>
          View all clubs →
        </Link>
      </div>

      {loading && <p className={styles.message}>Loading clubs...</p>}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!loading && !error && clubs.length === 0 && (
        <div className={styles.empty}>
          <p>No clubs available yet.</p>
          {account && (
            <Link to="/clubs" className={styles.createLink}>
              Create the first club →
            </Link>
          )}
        </div>
      )}

      {!loading && !error && clubs.length > 0 && (
        <div className={styles.clubs}>
          {clubs.map((club) => (
            <ClubsCard key={club.club_id} club={club} onJoin={fetchClubs} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeClubs;
