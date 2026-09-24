import { Router } from 'express';
import {
  addMovie,
  createClub,
  getClubs,
  getMovies,
  putClub,
  removeClub,
  removeMovie,
} from '../controllers/ClubController.js';
import clubRoleAuth from '../helper/clubRoleAuth.js';
import { auth } from '../helper/auth.js';

const router = Router();

router.get('/', getClubs);
router.post('/', auth, createClub);
router.delete('/:club_id', auth, clubRoleAuth(['owner']), removeClub);
router.put('/:club_id', auth, clubRoleAuth(['owner']), putClub);
router.get('/:club_id/movies', getMovies);
router.post(
  '/:club_id/movies/:movie_id',
  auth,
  clubRoleAuth(['owner', 'member']),
  addMovie
);
router.delete(
  '/:club_id/movies/:movie_id',
  auth,
  clubRoleAuth(['owner', 'member']),
  removeMovie
);

export default router;
