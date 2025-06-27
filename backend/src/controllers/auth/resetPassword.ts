// src/controllers/auth/resetPassword.ts
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '../../models/User'; // Mongoose model

export const resetPassword = async (req: Request, res: Response) => {
  const { phone, newPassword } = req.body;

  try {
    const user = await User.findOne({ phoneNumber: phone });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({
      message: 'Password reset failed',
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
