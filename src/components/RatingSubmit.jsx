import { genreIdToKeyMap } from './MovieAlgorithm/genreIdToKeyMap';
import api from '../util/api';

export const getGenreIdFromKey = (genreName) => {
  const cleanName = genreName.trim();
  const foundPair = Object.entries(genreIdToKeyMap).find(([id, key]) =>
    key.startsWith(cleanName)
  );
  return foundPair ? Number(foundPair[0]) : null;
};

const RatingSubmit = async (
  ratingValue,
  reviewText,
  movie,
  ratingLoading,
  setRatingLoading,
  setRatingMessage,
  fetchReviews
) => {
  if (ratingLoading) return;
  if (ratingValue === 0) {
    setRatingMessage('Please select a star rating first.');
    return;
  }

  setRatingLoading(true);
  setRatingMessage('');

  try {
    const genreIds = movie?.genres
      ? movie.genres
          .map((name) => getGenreIdFromKey(name))
          .filter((id) => id !== null)
      : [];

    const [reviewResponse, interactResponse] = await Promise.all([
      api.post(`${import.meta.env.VITE_API_URL}/movies/${movie.id}/reviews`, {
        rating: Math.round(ratingValue),
        text: reviewText,
        movieTitle: movie.title || movie.originalTitle || 'Unknown Movie',
      }),

      api.post(`${import.meta.env.VITE_API_URL}/accounts/interact`, {
        genreIds: genreIds,
        rating: ratingValue,
      }),
    ]);

    if (interactResponse.data?.success && interactResponse.data?.preferences) {
      sessionStorage.setItem(
        'user_preferences',
        JSON.stringify(interactResponse.data.preferences)
      );
    }

    setRatingMessage('Review and preferences submitted successfully!');
    await fetchReviews();
  } catch (err) {
    setRatingMessage(
      err.response?.data?.error?.message || 'Failed to submit data.'
    );
  } finally {
    setRatingLoading(false);
  }
};

export { RatingSubmit };
