import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Create User
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phoneNumber, password, role, name } = req.body;
  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      res.status(400).json({ message: 'Phone number already exists' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      phoneNumber,
      password: hashedPassword,
      role,
      name,
    });
    await user.save();
    res.status(201).json({
      data: {
        message: 'User created',
        role: user.role,
        name: user.name,
        user: { id: user._id, phoneNumber, role, name },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login User
export const login = async (req: Request, res: Response): Promise<void> => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      res.status(401).json({ message: 'Invalid phone number or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid phone number or password' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET ?? 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({
      data: {
        message: 'Login successful',
        token,
        role: user.role,
        name: user.name,
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          role: user.role,
          name: user.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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
  const { phoneNumber, password, role, name } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;
    if (name) user.name = name;
    await user.save();
    res.json({
      message: 'User updated',
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        name: user.name,
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
