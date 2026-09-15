import TopbarTab from './TopbarTab';
import styles from './Topbar.module.css';
import logo from '../assets/MovieNightLogoVer2.png';

const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <img src={logo} alt="MovieNight logo" className={styles.logo} />

      <div className={styles.center}>
        <TopbarTab to="/" text="Home" styles={styles.tab} />
        <TopbarTab to="/search" text="Search" styles={styles.tab} />
        <TopbarTab to="/clubs" text="Clubs" styles={styles.tab} />
      </div>

      <TopbarTab to="/account" text="My account" styles={styles.account} />
    </div>
  );
};

export default Topbar;
