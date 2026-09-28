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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <div>
      <div className="titlediv">
        <h1 className={styles.title}>Clubs</h1>
      </div>
      {account && (
        <div className={styles.filters}>
          <button onClick={() => setFilter('all')}>All clubs</button>
          <button onClick={() => setFilter('owner')}>Owner</button>
          <button onClick={() => setFilter('member')}>Member</button>
          <button onClick={() => setFilter('pending')}>Pending request</button>
          <p>{filter}</p>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {clubs && (
        <div className={styles.clubs}>
          {clubs.map((c) => (
            <ClubsCard key={c.club_id} club={c} onJoin={fetchData}></ClubsCard>
          ))}
        </div>
      )}
      {account && (
        <button onClick={() => setClubModal(true)}>Create Club</button>
      )}
      {clubModal && (
        <Modal setModal={setClubModal}>
          <CreateClub onCreate={fetchData}></CreateClub>
        </Modal>
      )}
    </div>
  );
};
export default Clubs;
