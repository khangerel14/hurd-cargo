import express, { Request, Response, NextFunction } from 'express';
import { validationResult, query } from 'express-validator';
import {
  getUsers,
  updateUser,
  deleteUser,
  loginOrSignUp,
  getUserById,
  getUserByPhoneNumber,
} from '../controllers/userController';

const router = express.Router();

router.get(
  '/user',
  [
    query('phoneNumber')
      .isString()
      .notEmpty()
      .withMessage('Phone number must be a non-empty string'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    getUserByPhoneNumber(req, res);
  }
);

// Create or login user
router.post('/auth', loginOrSignUp);

// General routes
router.get('/', getUsers);

// Parameterized routes last
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
