import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// Create User
const SECRET_KEY = process.env.JWT_SECRET ?? 'secret';

export const loginOrSignUp = async (req: Request, res: Response) => {
  const { phoneNumber, role } = req.body;

  if (!phoneNumber || !role) {
    return res.status(400).json({
      status: 400,
      message: 'Phone number and role are required.',
    });
  }

  try {
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      try {
        user = await User.create({ phoneNumber, role });
        console.log('User created');
      } catch (err: any) {
        if (err.code === 11000) {
          user = await User.findOne({ phoneNumber });
          console.log('User found after duplicate error');
        } else {
          throw err;
        }
      }
    } else {
      console.log('User logged in');
    }

    const token = jwt.sign({ id: user?.id, role: user?.role }, SECRET_KEY, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      status: 200,
      message: 'Login or signup successful',
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Server error',
      error,
    });
  }
};

// Get All Users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get User by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update User
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phoneNumber, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (role) user.role = role;
    await user.save();
    res.json({
      message: 'User updated',
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete User
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserByPhoneNumber = async (
  req: any,
  res: Response
): Promise<void> => {
  const { phoneNumber } = req.query;

  try {
    const user = await User.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      res.status(404).json({ message: 'No users found for this phone number' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error occurred:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};
