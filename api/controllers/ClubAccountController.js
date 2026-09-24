import {
  deleteClubAccount,
  insertClubAccount,
  selectClubAccount,
  updateRole,
} from '../models/ClubAccount.js';

const getClubRoles = async (req, res, next) => {
  const club_id = req.params.club_id;
  try {
    const result = await selectClubAccount(club_id);
    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const joinClub = async (req, res, next) => {
  const club_id = req.params.club_id;
  const account_id = req.account.account_id;
  try {
    const result = await insertClubAccount(account_id, club_id);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const leaveClub = async (req, res, next) => {
  const club_id = req.params.club_id;
  const account_id = req.account.account_id;
  if (req.clubRole === 'owner') {
    const error = new Error('Owner cannot leave');
    error.status = 400;
    return next(error);
  }
  try {
    await deleteClubAccount(account_id, club_id);
    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};

const removeClubAccount = async (req, res, next) => {
  const club_id = req.params.club_id;
  const account_id = req.params.account_id;
  if (Number(account_id) === req.account.account_id) {
    const error = new Error('Use leave to remove yourself');
    error.status = 400;
    return next(error);
  }
  try {
    await deleteClubAccount(account_id, club_id);
    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};

const changeRole = async (req, res, next) => {
  const club_id = req.params.club_id;
  const account_id = req.params.account_id;
  const { role } = req.body;
  try {
    console.log(club_id, account_id, role);
    const result = await updateRole(account_id, club_id, role);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export { getClubRoles, joinClub, leaveClub, removeClubAccount, changeRole };
