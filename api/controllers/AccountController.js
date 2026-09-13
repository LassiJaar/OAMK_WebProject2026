import { compare, hash } from 'bcrypt';
import {
  deleteAccount,
  getAccountByEmail,
  insertAccount,
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
      .json({ account_id: account.account_id, email: account.email, token });
  } catch (error) {
    return next(error);
  }
};

export { createAccount, removeAccount, login };
