import { Link } from 'react-router';
import styles from './ClubsCard.module.css';

const ClubsCard = ({ club, user }) => {
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
      <button className={styles.button} onClick={() => console.log('clicked')}>
        Request to join
      </button>
    </div>
  );
};
export default ClubsCard;
