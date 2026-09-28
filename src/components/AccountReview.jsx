import { Link } from 'react-router';
import styles from './AccountReview.module.css';

const AccountReview = ({ review }) => {
  const rating = Number(review.rating);

  return (
    <div className={styles.review}>
      <div className={styles.header}>
        <Link to={`/movie/${review.movie_id}`} className={styles.movieTitle}>
          {review.movieTitle || `Movie #${review.movie_id}`}
        </Link>

        <div className={styles.rating} aria-label={`Rating ${rating} out of 5`}>
          {'★'.repeat(rating)}
          {'☆'.repeat(5 - rating)}
        </div>
      </div>

      {review.text && <p className={styles.text}>{review.text}</p>}
    </div>
  );
};

export default AccountReview;
