// src/controllers/auth/verifyOtp.ts
import { twilioClient, verifySid } from '../../utils/twilio';
import { Request, Response } from 'express';

export const verifyOTP = async (req: Request, res: Response) => {
  const { phone, code } = req.body;

  try {
    const verificationCheck = await twilioClient.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: `+976${phone}`, code });

    if (verificationCheck.status === 'approved') {
      res.status(200).json({ message: 'OTP verified' });
    } else {
      res.status(400).json({ message: 'Invalid code' });
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res
      .status(500)
      .json({ message: 'Failed to verify OTP', error: errorMessage });
  }
};
