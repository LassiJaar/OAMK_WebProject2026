import { Router } from 'express';
import {
  getFavorites,
  createFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/FavoriteController.js';
import { auth } from '../helper/auth.js';

const router = Router();

router.get('/accounts/:id/favorites', getFavorites);

router.get('/:movie_id/favorite', auth, checkFavorite);
router.post('/:movie_id/favorite', auth, createFavorite);
router.delete('/:movie_id/favorite', auth, removeFavorite);

export default router;
