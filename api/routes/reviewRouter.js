import { Router } from 'express';
import {
  createReview,
  getLatestReviewsByAccount,
  getReviewsByMovie,
  removeReview,
} from '../controllers/ReviewController.js';
import { auth } from '../helper/auth.js';

const router = Router();

router.get('/accounts/:id/reviews', getLatestReviewsByAccount);
router.get('/:movie_id/reviews', getReviewsByMovie);
router.post('/:movie_id/reviews', auth, createReview);
router.delete('/:movie_id/reviews/:account_id', auth, removeReview);

export default router;
