import { Link } from 'react-router';

const TopbarTab = ({ to, text, styles }) => {
  return (
    <Link to={to} className={styles}>
      {text}
    </Link>
  );
};

export default TopbarTab;
