DROP TABLE IF EXISTS club_movie;
DROP TABLE IF EXISTS club_account;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS club;
DROP TABLE IF EXISTS account;

DROP TYPE IF EXISTS club_role;

CREATE TYPE club_role AS ENUM (
  'owner',
  'member',
  'pending'
);

CREATE TABLE IF NOT EXISTS account (
  account_id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  preferences JSONB NOT NULL DEFAULT '{
    "Action28": 0.5,
    "Adventure12": 0.5,
    "Animation16": 0.5,
    "Comedy35": 0.5,
    "Crime80": 0.5,
    "Documentary99": 0.5,
    "Drama18": 0.5,
    "Family10751": 0.5,
    "Fantasy14": 0.5,
    "History36": 0.5,
    "Horror27": 0.5,
    "Music10402": 0.5,
    "Mystery9648": 0.5,
    "Romance10749": 0.5,
    "SciFi878": 0.5,
    "TV10770": 0.5,
    "Thriller53": 0.5,
    "War10752": 0.5,
    "Western37": 0.5
  }'::jsonb
);

CREATE TABLE IF NOT EXISTS club (
  club_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS club_movie (
  club_id INT NOT NULL
    REFERENCES club (club_id)
    ON DELETE CASCADE,

  movie_id INT NOT NULL,

  PRIMARY KEY (club_id, movie_id),

  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS club_account (
  club_id INT NOT NULL
    REFERENCES club (club_id)
    ON DELETE CASCADE,

  account_id INT NOT NULL
    REFERENCES account (account_id)
    ON DELETE CASCADE,

  role club_role NOT NULL,

  PRIMARY KEY (club_id, account_id),

  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review (
  movie_id INT NOT NULL,

  account_id INT NOT NULL
    REFERENCES account (account_id)
    ON DELETE CASCADE,

  PRIMARY KEY (movie_id, account_id),

  text TEXT,

  rating INT NOT NULL
    CHECK (rating BETWEEN 1 AND 5),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorite (
  movie_id INT NOT NULL,

  account_id INT NOT NULL
    REFERENCES account (account_id)
    ON DELETE CASCADE,

  PRIMARY KEY (movie_id, account_id),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);