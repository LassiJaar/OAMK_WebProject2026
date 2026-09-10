import { Link } from 'react-router';

const TopbarTab = ({ to, text, styles }) => {
  return (
    <Link to={to}>
      <p className={styles}>{text}</p>
    </Link>
  );
};

export default TopbarTab;
