import { useEffect, useState } from 'react';
import styles from './Clubs.module.css';
import ClubsCard from './ClubsCard';
import Modal from './Modal';
import CreateClub from './CreateClub';
import { useAccount } from '../context/useAccount';
import api from '../util/api';

const Clubs = () => {
  const { account } = useAccount();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clubModal, setClubModal] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (account) {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/clubs/me`,
          {
            params: {
              role: filter,
            },
          }
        );

        setClubs(response.data);
      } else {
        const response = await api.get(`${import.meta.env.VITE_API_URL}/clubs`);

        setClubs(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not load clubs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [account, filter]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Clubs</h1>
          <p>Find people to share your movie interests with.</p>
        </div>

        {account && (
          <button
            type="button"
            className={styles.createButton}
            onClick={() => setClubModal(true)}
          >
            Create club
          </button>
        )}
      </header>

      {account && (
        <nav className={styles.filters} aria-label="Club filters">
          <button
            type="button"
            className={filter === 'all' ? styles.activeFilter : ''}
            onClick={() => setFilter('all')}
          >
            All clubs
          </button>

          <button
            type="button"
            className={filter === 'owner' ? styles.activeFilter : ''}
            onClick={() => setFilter('owner')}
          >
            Owner
          </button>

          <button
            type="button"
            className={filter === 'member' ? styles.activeFilter : ''}
            onClick={() => setFilter('member')}
          >
            Member
          </button>

          <button
            type="button"
            className={filter === 'pending' ? styles.activeFilter : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
        </nav>
      )}

      {loading && <p className={styles.message}>Loading clubs...</p>}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!loading && !error && clubs.length === 0 && (
        <section className={styles.empty}>
          <h2>No clubs found</h2>
          <p>
            {account
              ? 'You are not part of any clubs yet.'
              : 'There are no clubs available yet.'}
          </p>
        </section>
      )}

      {!loading && !error && clubs.length > 0 && (
        <div className={styles.clubs}>
          {clubs.map((club) => (
            <ClubsCard key={club.club_id} club={club} onJoin={fetchData} />
          ))}
        </div>
      )}

      {clubModal && (
        <Modal setModal={setClubModal}>
          <CreateClub
            onCreate={() => {
              setClubModal(false);
              fetchData();
            }}
          />
        </Modal>
      )}
    </main>
  );
};

export default Clubs;
