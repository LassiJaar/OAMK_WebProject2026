import { useState } from 'react';
import axios from 'axios';
import styles from './Search.module.css';
import DropdownSelector from './DropdownSelector';
import MovieCard from './MovieCard';

const Search = () => {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState(-1);
  const [rating, setRating] = useState(-1);
  const [minYear, setMinYear] = useState(-1);
  const [maxYear, setMaxYear] = useState(-1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const genres = [
    { id: -1, name: 'Genres' },
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ];
  const ratings = [
    {
      value: -1,
      name: 'Ratings',
    },
    {
      value: 0,
      name: '0',
    },
    {
      value: 1,
      name: '1',
    },
    {
      value: 2,
      name: '2',
    },
    {
      value: 3,
      name: '3',
    },
    {
      value: 4,
      name: '4',
    },
    {
      value: 5,
      name: '5',
    },
    {
      value: 6,
      name: '6',
    },
    {
      value: 7,
      name: '7',
    },
    {
      value: 8,
      name: '8',
    },
    {
      value: 9,
      name: '9',
    },
    {
      value: 10,
      name: '10',
    },
  ];
  let currentYear = new Date().getFullYear();
  const startYear = 1900;
  const years = [];
  while (startYear < currentYear) {
    years.push({ value: currentYear, name: currentYear });
    currentYear--;
  }

  const sendSearch = async () => {
    if (!search.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params = { query: search.trim() };
      if (genre !== -1) params.genre = genre;
      if (rating !== -1) params.rating = rating;
      if (minYear !== -1) params.minYear = minYear;
      if (maxYear !== -1) params.maxYear = maxYear;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/movies/search`,
        { params }
      );
      setResults(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Could not search for movies'
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendSearch();
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.pageTitle}>Search movies</h1>

      <section className={styles.searchSection}>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            className={styles.searchbar}
            type="text"
            placeholder="Search movies by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>

        <div className={styles.advanced}>
          <h2>Advanced options</h2>

          <div className={styles.options}>
            <DropdownSelector
              selected={genre}
              setSelected={setGenre}
              options={genres.map((g) => {
                return { value: g.id, name: g.name };
              })}
            />

            <DropdownSelector
              selected={minYear}
              setSelected={setMinYear}
              options={[{ value: -1, name: 'Start year' }].concat(
                years.filter((y) => y.name <= (maxYear !== -1 ? maxYear : 3000))
              )}
            />

            <DropdownSelector
              selected={maxYear}
              setSelected={setMaxYear}
              options={[{ value: -1, name: 'End year' }].concat(
                years.filter((y) => y.name >= minYear)
              )}
            />

            <DropdownSelector
              selected={rating}
              setSelected={setRating}
              options={ratings}
            />
          </div>
        </div>
      </section>

      <section className={styles.filters}>
        <h2>Active filters</h2>

        <div className={styles.activefilters}>
          {genre !== -1 && (
            <span>Genre: {genres.find((g) => g.id === genre)?.name}</span>
          )}

          {(minYear !== -1 || maxYear !== -1) && (
            <span>
              Year: {minYear !== -1 ? minYear : ''}-
              {maxYear !== -1 ? maxYear : ''}
            </span>
          )}

          {rating !== -1 && <span>Rating: &gt;{rating}</span>}

          {genre === -1 &&
            minYear === -1 &&
            maxYear === -1 &&
            rating === -1 && (
              <span className={styles.noFilters}>No active filters</span>
            )}
        </div>
      </section>

      <section className={styles.results}>
        {loading && <p className={styles.message}>Searching...</p>}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {!loading && !error && results.length === 0 && (
          <p className={styles.message}>Search results will appear here.</p>
        )}

        {!loading && !error && results.length > 0 && (
          <div className={styles.moviegrid}>
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Search;
