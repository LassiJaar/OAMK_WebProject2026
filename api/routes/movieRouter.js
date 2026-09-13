import { Router } from 'express';
import { getMovies } from '../controllers/MovieController.js';

const router = Router();

router.get('/search', getMovies);

export default router;
import { getNowPlaying } from '../controllers/MovieController.js';

const router = Router();

router.get('/now-playing', getNowPlaying);

export default router;
