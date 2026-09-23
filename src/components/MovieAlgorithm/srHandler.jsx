import { genreIdToKeyMap } from './genreIdToKeyMap'; 

const calculateSR = (movie, preferences) => {
  if (!movie.genre_ids || !movie.genre_ids.length || !preferences) {
    return 0.5; 
  }

  let totalScore = 0;

  movie.genre_ids.forEach((genreId) => {
    const genreKey = genreIdToKeyMap[Number(genreId)];
    
    const score = (genreKey && preferences[genreKey] !== undefined)
      ? preferences[genreKey] 
      : 0.5;
    
    totalScore += score;
  });
  
  const average = totalScore / movie.genre_ids.length;
  return Math.round(average * 100) / 100;
};

const randomizeSR = (sr, intensity = 0.05) => {
  const randomShift = (Math.random() * 2 - 1) * intensity;
  const randomized = sr + randomShift;
  const clamped = Math.max(0, Math.min(1, randomized));
  return Math.round(clamped * 100) / 100;
};

export { calculateSR, randomizeSR }