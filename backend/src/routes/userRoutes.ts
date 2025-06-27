import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult, query } from 'express-validator';
import {
  createUser,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByPhoneNumber,
} from '../controllers/userController';

const router = express.Router();

router.post(
  '/login',
  [
    body('phoneNumber')
      .isString()
      .notEmpty()
      .withMessage('Phone number is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    login(req, res);
  }
);

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

// General routes
router.post('/', createUser);
router.get('/', getUsers);

// Parameterized routes last
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
