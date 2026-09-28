import { Router } from 'express';
import clubRoleAuth from '../helper/clubRoleAuth.js';
import { auth } from '../helper/auth.js';
import {
  changeRole,
  getClubRole,
  getClubRoles,
  joinClub,
  leaveClub,
  removeClubAccount,
} from '../controllers/ClubAccountController.js';

const router = Router({ mergeParams: true });

router.get('/accounts', getClubRoles);
router.get('/accounts/me', auth, getClubRole);
router.post('/', auth, joinClub);
router.delete('/accounts/me', auth, clubRoleAuth(['any']), leaveClub);
router.delete(
  '/accounts/:account_id',
  auth,
  clubRoleAuth(['owner']),
  removeClubAccount
);
router.patch(
  '/accounts/:account_id',
  auth,
  clubRoleAuth(['owner']),
  changeRole
);

export default router;
