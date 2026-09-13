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
    {
      id: 28,
      name: 'Action',
    },
    {
      id: 12,
      name: 'Abenteuer',
    },
    {
      id: 16,
      name: 'Animation',
    },
    {
      id: 35,
      name: 'Komödie',
    },
    {
      id: 80,
      name: 'Krimi',
    },
    {
      id: 99,
      name: 'Dokumentarfilm',
    },
    {
      id: 18,
      name: 'Drama',
    },
    {
      id: 10751,
      name: 'Familie',
    },
    {
      id: 14,
      name: 'Fantasy',
    },
    {
      id: 36,
      name: 'Historie',
    },
    {
      id: 27,
      name: 'Horror',
    },
    {
      id: 10402,
      name: 'Musik',
    },
    {
      id: 9648,
      name: 'Mystery',
    },
    {
      id: 10749,
      name: 'Liebesfilm',
    },
    {
      id: 878,
      name: 'Science Fiction',
    },
    {
      id: 10770,
      name: 'TV-Film',
    },
    {
      id: 53,
      name: 'Thriller',
    },
    {
      id: 10752,
      name: 'Kriegsfilm',
    },
    {
      id: 37,
      name: 'Western',
    },
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

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/movies/search`, { params });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not search for movies');
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
    <div>
      <div className="titlediv">
        <h1>Search</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.searchbar}
            type="text"
            placeholder="Search movies by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></input>
          <button type="submit">Search</button>
        </form>
      </div>
      <div className={styles.advanced}>
        <p>Advanced options</p>
        <div className={styles.options}>
          <DropdownSelector
            selected={genre}
            setSelected={setGenre}
            options={genres.map((g) => {
              return { value: g.id, name: g.name };
            })}
          ></DropdownSelector>
          <DropdownSelector
            selected={minYear}
            setSelected={setMinYear}
            options={[{ value: -1, name: 'Start year' }].concat(
              years.filter((y) => y.name <= (maxYear != -1 ? maxYear : 3000))
            )}
          ></DropdownSelector>
          <DropdownSelector
            selected={maxYear}
            setSelected={setMaxYear}
            options={[{ value: -1, name: 'End year' }].concat(
              years.filter((y) => y.name >= minYear)
            )}
          ></DropdownSelector>
          <DropdownSelector
            selected={rating}
            setSelected={setRating}
            options={ratings}
          ></DropdownSelector>
        </div>
      </div>
      <div className={styles.filters}>
        <p>Active filter(s):</p>
        <div className={styles.activefilters}>
          {genre != -1 && (
            <p>Genre: {genres.find((g) => g.id == genre).name}</p>
          )}
          {(minYear != -1 || maxYear != -1) && (
            <p>
              Year:{' '}
              {`${minYear != -1 ? minYear : ''}-${maxYear != -1 ? maxYear : ''}`}
            </p>
          )}
          {rating != -1 && <p>Rating: {`>${rating}`}</p>}
        </div>
      </div>
      <div className={styles.results}>
        {loading && <p>Searching...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && results.length === 0 && <p>Search results</p>}
        {!loading && !error && results.length > 0 && (
          <div className={styles.moviegrid}>
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
