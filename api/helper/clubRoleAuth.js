import { pool } from '../models/db.js';
const clubRoleAuth = (allowedRoles) => {
  return async (req, res, next) => {
    if (allowedRoles == ['any']) {
      return next();
    }
    const account_id = req.account.account_id;
    const club_id = req.params.club_id;

    try {
      const result = await pool.query(
        'SELECT * FROM club_account WHERE account_id = $1 AND club_id = $2;',
        [account_id, club_id]
      );
      if (
        result.rows.length == 0 ||
        !allowedRoles.includes(result.rows[0].role)
      ) {
        const error = new Error('You do not have the required role');
        error.status = 403;
        return next(error);
      }
      req.clubRole = result.rows[0].role;
      return next();
    } catch (error) {
      next(error);
    }
  };
};

export default clubRoleAuth;
