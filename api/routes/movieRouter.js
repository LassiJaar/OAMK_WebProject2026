import { Router } from 'express';
import { getMovies } from '../controllers/MovieController.js';
import { getNowPlaying } from '../controllers/MovieController.js';

const router = Router();

router.get('/now-playing', getNowPlaying);
router.get('/search', getMovies);
export default router;
