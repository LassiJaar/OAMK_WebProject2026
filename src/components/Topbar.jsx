import TopbarTab from './TopbarTab';
import styles from './Topbar.module.css';
import logo from '../assets/MovieNightLogoVer2.png';
import { useAccount } from '../context/useAccount';

const Topbar = () => {
  const { account } = useAccount();
  return (
    <div className={styles.topbar}>
      <img src={logo} alt="MovieNight logo" className={styles.logo} />

      <div className={styles.center}>
        <TopbarTab to="/" text="Home" styles={styles.tab} />
        <TopbarTab to="/search" text="Search" styles={styles.tab} />
        <TopbarTab to="/clubs" text="Clubs" styles={styles.tab} />
      </div>
      {account && (
        <TopbarTab to="/account" text="My account" styles={styles.account} />
      )}
      {!account && (
        <TopbarTab to="/signin" text="Sign In" styles={styles.account} />
      )}
    </div>
  );
};

export default Topbar;
