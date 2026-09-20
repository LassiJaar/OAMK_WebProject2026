import { Router } from 'express';
import { getMovies, getMovie, getNowPlaying } from '../controllers/MovieController.js';

const router = Router();

router.get('/now-playing', getNowPlaying);
router.get('/search', getMovies);
router.get('/:id', getMovie);
export default router;
