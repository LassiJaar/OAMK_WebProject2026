import { useEffect, useState } from 'react';
import styles from './Clubs.module.css';
import axios from 'axios';
import ClubsCard from './ClubsCard';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/clubs`);
      setClubs(response.data);
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
        <h1 className={styles.title}>Clubs</h1>
      </div>
      <div className={styles.filters}>
        <button onClick={() => setFilter('all')}>All clubs</button>
        <button onClick={() => setFilter('my')}>My clubs</button>
        <button onClick={() => setFilter('pending')}>Pending request</button>
        <p>{filter}</p>
      </div>
      {loading && <p>Loading...</p>}
      {clubs && (
        <div className={styles.clubs}>
          {clubs.map((c) => (
            <ClubsCard key={c.club_id} club={c}></ClubsCard>
          ))}
        </div>
      )}
    </div>
  );
};
export default Clubs;
