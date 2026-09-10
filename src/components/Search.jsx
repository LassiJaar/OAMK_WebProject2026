import { useState } from 'react';
import styles from './Search.module.css';
import DropdownSelector from './DropdownSelector';

const Search = () => {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState(-1);
  const [rating, setRating] = useState(-1);
  const [minYear, setMinYear] = useState(-1);
  const [maxYear, setMaxYear] = useState(-1);
  const [results, setResults] = useState([]);
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
  ];
  let currentYear = new Date().getFullYear();
  const startYear = 1900;
  const years = [];
  while (startYear < currentYear) {
    years.push({ value: currentYear, name: currentYear });
    currentYear--;
  }

  const sendSearch = () => {
    console.log(`Searching ${search} ${genre} ${rating} ${minYear} ${maxYear}`);
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
        {results.length == 0 && <p>Search results</p>}
      </div>
    </div>
  );
};

export default Search;
