import { Link } from 'react-router';
import styles from './ClubsCard.module.css';
import api from '../util/api';
import { useAccount } from '../context/useAccount';

const ClubsCard = ({ club, onJoin }) => {
  const { account } = useAccount();
  const handleJoin = async () => {
    await api.post(`${import.meta.env.VITE_API_URL}/clubs/${club.club_id}`);
    onJoin();
  };
  return (
    <div className={styles.card}>
      <Link to={`/clubs/${club.club_id}`}>
        <div>
          <p>{club.name}</p>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Image.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
            alt={club.club_id}
          ></img>
        </div>
      </Link>
      {club.role === 'owner' && <p>Owner</p>}
      {club.role === 'member' && <p>Member</p>}
      {club.role === 'pending' && <p>Already requested</p>}
      {!club.role && account && (
        <button className={styles.button} onClick={handleJoin}>
          Request to join
        </button>
      )}
      {!account && <p>Sign in</p>}
    </div>
  );
};
export default ClubsCard;
