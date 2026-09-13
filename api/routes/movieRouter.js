import { Router } from 'express';
import { getNowPlaying } from '../controllers/MovieController.js';

const router = Router();

router.get('/now-playing', getNowPlaying);

export default router;
