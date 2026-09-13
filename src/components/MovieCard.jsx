import { Link } from 'react-router';
import styles from './MovieCard.module.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie }) => {
  return (
    <div className={styles.card}>
      <Link to={`/movie/${movie.id}`}>
        <div>
          <p>{movie.title}</p>

          {movie.posterPath ? (
            <img
              src={`${IMAGE_BASE_URL}${movie.posterPath}`}
              alt={`${movie.title} poster`}
            />
          ) : (
            <p>No poster available</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
