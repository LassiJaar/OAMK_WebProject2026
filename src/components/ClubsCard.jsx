import { Link } from 'react-router';
import styles from './ClubsCard.module.css';
import api from '../util/api';
import { useAccount } from '../context/useAccount';

const DEFAULT_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/6/6c/Image.svg';

const ClubsCard = ({ club, onJoin }) => {
  const { account } = useAccount();

  const handleJoin = async () => {
    try {
      await api.post(`${import.meta.env.VITE_API_URL}/clubs/${club.club_id}`);
      onJoin();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <article className={styles.card}>
      <Link to={`/clubs/${club.club_id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img
            src={club.image_url || DEFAULT_IMAGE}
            alt=""
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{club.name}</h2>

          {club.description && (
            <p className={styles.description}>{club.description}</p>
          )}
        </div>
      </Link>

      <div className={styles.footer}>
        {club.role === 'owner' && <span className={styles.role}>Owner</span>}

        {club.role === 'member' && <span className={styles.role}>Member</span>}

        {club.role === 'pending' && (
          <span className={styles.pending}>Request pending</span>
        )}

        {!club.role && account && (
          <button type="button" className={styles.button} onClick={handleJoin}>
            Request to join
          </button>
        )}

        {!account && <span className={styles.signIn}>Sign in to join</span>}
      </div>
    </article>
  );
};

export default ClubsCard;
