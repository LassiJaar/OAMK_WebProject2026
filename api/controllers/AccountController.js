import { compare, hash } from 'bcrypt';
import {
  deleteAccount,
  getAccountByEmail,
  getAccountById,
  insertAccount,
  selectAccountStatistics,
  updatePassword,
  updateAccountPreferences,
} from '../models/Account.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

const createAccount = async (req, res, next) => {
  const email = req.body.account?.email?.trim().toLowerCase();
  const password = req.body.account?.password;
  try {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      return next(error);
    }
    const hashedPassword = await hash(password, 10);
    const result = await insertAccount(email, hashedPassword);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const removeAccount = async (req, res, next) => {
  const { id } = req.params;
  if (req.account?.account_id != id) {
    const error = new Error('You can only delete your own account');
    error.status = 403;
    return next(error);
  }
  try {
    await deleteAccount(id);
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  const email = req.body.account?.email?.trim().toLowerCase();
  const password = req.body.account?.password;

  try {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      return next(error);
    }
    const result = await getAccountByEmail(email);
    const account = result.rows[0];
    if (!account || !(await compare(password, account.password))) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      return next(error);
    }
    const token = sign(
      { account_id: account.account_id, email: account.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res
      .status(200)
      .json({ account_id: account.account_id, email: account.email, token, preferences: account.preferences });
  } catch (error) {
    return next(error);
  }
};

const getAccountStatistics = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await selectAccountStatistics(id);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
};

const patchPassword = async (req, res, next) => {
  const { id } = req.params;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  if (req.account?.account_id != id) {
    const error = new Error('You can only change your own password');
    error.status = 403;
    return next(error);
  }
  try {
    const result = await getAccountById(id);
    const account = result.rows[0];
    if (!account || !(await compare(oldPassword, account.password))) {
      const error = new Error('Invalid password');
      error.status = 401;
      return next(error);
    }
    const hashedPassword = await hash(newPassword, 10);
    await updatePassword(id, hashedPassword);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  const { genreIds, rating } = req.body;
  const accountId = req.account?.account_id;

  if (!Array.isArray(genreIds) || genreIds.length === 0 || rating === undefined) {
    const error = new Error('genreIds array and rating are required');
    error.status = 400;
    return next(error);
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
    const error = new Error('Rating must be a number between 0 and 5');
    error.status = 400;
    return next(error);
  }

  const alpha = 0.1;
  const reward = (numericRating - 2.5) / 2.5;

  try {
    const jsonTarget = {};
    genreIds.forEach((id) => {
      jsonTarget[String(id)] = reward;
    });

    const result = await updateAccountPreferences(accountId, JSON.stringify(jsonTarget));
    
    if (result.rowCount === 0) {
      const error = new Error('Account not found');
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      preferences: result.rows[0].preferences
    });
  } catch (error) {
    next(error);
  }
};

export {
  createAccount,
  removeAccount,
  login,
  getAccountStatistics,
  patchPassword,
  updatePreferences,
};
