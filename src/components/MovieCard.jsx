import { Link } from 'react-router';
import styles from './MovieCard.module.css';

const MovieCard = ({ movie }) => {
  return (
    <div className={styles.card}>
      <Link to={`/movie/${movie.movie_id}`}>
        <div>
          <p>{movie.title}</p>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Image.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
            alt={movie.movie_id}
          ></img>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;