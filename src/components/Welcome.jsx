import { Link } from 'react-router';
import styles from './Welcome.module.css';

const Welcome = () => {
  return (
    <section className={styles.welcome}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>WELCOME TO MOVIENIGHT</p>

        <h1>Find your next favourite movie.</h1>

        <p className={styles.description}>
          Discover films, share your reviews and find your movie community.
        </p>

        <Link to="/search" className={styles.button}>
          Explore movies
        </Link>
      </div>
    </section>
  );
};

export default Welcome;
