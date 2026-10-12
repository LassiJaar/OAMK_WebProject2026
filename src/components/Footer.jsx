import styles from './Footer.module.css';
import logo from '../assets/MovieNightLogo_simple.png';
import tmdbLogo from '../assets/tmdb-logo.svg';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <img src={logo} alt="MovieNight" className={styles.logo} />
          <p>Discover, Review and Connect.</p>
        </div>

        <div className={styles.credits}>
          <h3>Credits</h3>
          <p>
            Developed as part of the Web-ohjelmoinnin sovellusprojekti course at
            Oulu University of Applied Sciences (OAMK), 2026.
          </p>
        </div>

        <div className={styles.tmdb}>
          <img
            src={tmdbLogo}
            alt="The Movie Database (TMDB)"
            className={styles.tmdbLogo}
          />
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
