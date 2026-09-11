import TopbarTab from './TopbarTab';
import styles from './Topbar.module.css';

const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <img alt="MovieNight logo"></img>
      <div className={styles.center}>
        <TopbarTab to={'/'} text="Home"></TopbarTab>
        <TopbarTab to={'/search'} text="Search"></TopbarTab>
        <TopbarTab to={'/clubs'} text="Clubs"></TopbarTab>
      </div>
      <TopbarTab
        to={'/account'}
        text="My account"
        styles={styles.account}
      ></TopbarTab>
    </div>
  );
};

export default Topbar;
