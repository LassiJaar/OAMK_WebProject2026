import { Router } from 'express';
import {
  createAccount,
  getAccountStatistics,
  login,
  patchPassword,
  removeAccount,
  updatePreferences,
} from '../controllers/AccountController.js';
import { auth } from '../helper/auth.js';

const router = Router();

router.post('/signup', createAccount);
router.delete('/:id', auth, removeAccount);
router.post('/signin', login);
router.post('/interact', auth, updatePreferences);
router.get('/:id', getAccountStatistics);
router.patch('/:id', auth, patchPassword);

export default router;
