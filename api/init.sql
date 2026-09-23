DROP TABLE IF EXISTS club_movie;
DROP TABLE IF EXISTS club_account;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS club;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS movie;

DROP TYPE IF EXISTS club_role;
CREATE TYPE club_role AS ENUM ('owner', 'member', 'pending');

CREATE TABLE IF NOT EXISTS account (
  account_id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  preferences JSONB NOT NULL DEFAULT '{
    "Action28": 0.5, "Adventure12": 0.5, "Animation16": 0.5, "Comedy35": 0.5, "Crime80": 0.5, 
    "Documentary99": 0.5, "Drama18": 0.5, "Family10751": 0.5, "Fantasy14": 0.5, "History36": 0.5, 
    "Horror27": 0.5, "Music10402": 0.5, "Mystery9648": 0.5, "Romance10749": 0.5, "SciFi878": 0.5, 
    "TV10770": 0.5, "Thriller53": 0.5, "War10752": 0.5, "Western37": 0.5
  }'::jsonb
);

CREATE TABLE IF NOT EXISTS movie (
  movie_id INT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  overview TEXT,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS club (
  club_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS club_movie (
  club_id INT NOT NULL REFERENCES club (club_id) ON DELETE CASCADE,
  movie_id INT NOT NULL REFERENCES movie (movie_id) ON DELETE CASCADE,
  PRIMARY KEY (club_id, movie_id),
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS club_account (
  club_id INT NOT NULL REFERENCES club (club_id) ON DELETE CASCADE,
  account_id INT NOT NULL REFERENCES account (account_id) ON DELETE CASCADE,
  role club_role NOT NULL,
  PRIMARY KEY (club_id, account_id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review (
  movie_id INT NOT NULL REFERENCES movie (movie_id) ON DELETE CASCADE,
  account_id INT NOT NULL REFERENCES account (account_id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, account_id),
  text TEXT,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorite (
  movie_id INT NOT NULL REFERENCES movie (movie_id) ON DELETE CASCADE,
  account_id INT NOT NULL REFERENCES account (account_id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, account_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. Accounts
INSERT INTO account (email, password, created_at) VALUES
  ('alice@example.com', '$2b$12$eImiTXuWVxfM37uY4JANjO5E/0b36Y72W61qJ30z22eJg', '2024-01-10 09:00:00+00'),
  ('bob@example.com', '$2b$12$eImiTXuWVxfM37uY4JANjO5E/0b36Y72W61qJ30z22eJg', '2024-01-12 14:30:00+00'),
  ('charlie@example.com', '$2b$12$eImiTXuWVxfM37uY4JANjO5E/0b36Y72W61qJ30z22eJg', '2024-01-15 11:15:00+00'),
  ('diana@example.com', '$2b$12$eImiTXuWVxfM37uY4JANjO5E/0b36Y72W61qJ30z22eJg', '2024-02-01 16:45:00+00');

-- 2. Movies
INSERT INTO movie (movie_id, title, overview, created_at) VALUES
  (101, 'Inception', 'A thief who steals corporate secrets through dream-sharing technology.', '2024-01-01 10:00:00+00'),
  (102, 'Spirited Away', 'A young girl wanders into a world ruled by gods, witches, and spirits.', '2024-01-01 10:00:00+00'),
  (103, 'Pulp Fiction', 'The lives of two mob hitmen, a boxer, and a gangster and his wife intertwine.', '2024-01-01 10:00:00+00'),
  (104, 'The Matrix', 'A computer hacker learns about the true nature of his reality.', '2024-01-01 10:00:00+00');

-- 3. Clubs
INSERT INTO club (name, description, created_at) VALUES
  ('Sci-Fi Enthusiasts', 'A club for fans of science fiction cinema.', '2024-01-11 10:00:00+00'),
  ('Classic Cinema Society', 'Discussing iconic films throughout history.', '2024-01-16 12:00:00+00'),
  ('Anime & Animation Guild', 'Exploring the best of animated storytelling from Studio Ghibli to modern masterpieces.', '2024-02-05 10:00:00+00'),
  ('Horror & Thriller Lounge', 'For fans of jump scares, psychological thrillers, and spooky cinema.', '2024-02-08 14:15:00+00'),
  ('Documentary Film Circle', 'Deep dives into real-world stories, history, and investigative documentaries.', '2024-02-10 11:30:00+00'),
  ('Indie & Foreign Film Spot', 'Celebrating independent productions and international foreign language films.', '2024-02-12 16:45:00+00'),
  ('Action & Blockbuster Central', 'High-octane explosions, superhero sagas, and epic popcorn flicks.', '2024-02-15 09:20:00+00'),
  ('Rom-Com & Drama Corner', 'Heartwarming romances, tear-jerkers, and compelling character dramas.', '2024-02-18 18:00:00+00'),
  ('Cult Classics & B-Movies', 'Appreciating underground hits, campy horror, and forgotten cinema gems.', '2024-02-20 20:10:00+00');

-- 4. Club Memberships
INSERT INTO club_account (club_id, account_id, role, joined_at) VALUES
  (1, 1, 'owner', '2024-01-11 10:00:00+00'),
  (1, 2, 'member', '2024-01-13 09:30:00+00'),
  (1, 3, 'pending', '2024-02-02 18:20:00+00'),
  (2, 3, 'owner', '2024-01-16 12:00:00+00'),
  (2, 4, 'member', '2024-02-03 10:10:00+00');

-- 5. Club Movies
INSERT INTO club_movie (club_id, movie_id, added_at) VALUES
  (1, 101, '2024-01-12 11:00:00+00'),
  (1, 104, '2024-01-14 15:45:00+00'),
  (2, 102, '2024-01-17 13:00:00+00'),
  (2, 103, '2024-01-18 09:15:00+00');

-- 6. Reviews
INSERT INTO review (movie_id, account_id, text, rating, created_at) VALUES
  (101, 1, 'Mind-bending visual masterpiece!', 5, '2024-01-20 20:00:00+00'),
  (101, 2, 'Great action, though a bit confusing on first watch.', 4, '2024-01-22 14:10:00+00'),
  (102, 3, 'One of the best animated films ever made.', 5, '2024-01-25 19:30:00+00'),
  (103, 4, 'Classic non-linear storytelling.', 4, '2024-02-05 11:00:00+00');

-- 7. Favorites
INSERT INTO favorite (movie_id, account_id, created_at) VALUES
  (101, 1, '2024-01-20 20:05:00+00'),
  (104, 1, '2024-01-21 08:30:00+00'),
  (102, 3, '2024-01-25 19:35:00+00'),
  (101, 4, '2024-02-04 16:00:00+00');