import { Router } from 'express';
import { getClubs } from '../controllers/ClubController.js';

const router = Router();

router.get('/', getClubs);

export default router;
