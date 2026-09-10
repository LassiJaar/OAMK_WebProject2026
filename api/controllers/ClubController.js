import { getAllClubs } from '../models/Club.js';

const getClubs = async (req, res, next) => {
  try {
    const result = await getAllClubs();
    res.status(200).json(result.rows || []);
  } catch (error) {
    next(error);
  }
};

export { getClubs };
