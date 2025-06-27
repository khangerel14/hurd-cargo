// src/controllers/auth/sendOtp.ts
import { Request, Response } from 'express';
import { twilioClient, verifySid } from '../../utils/twilio';

export const sendOTP = async (req: Request, res: Response) => {
  const { phone } = req.body;

  try {
    const verification = await twilioClient.verify.v2
      .services(verifySid)
      .verifications.create({ to: `+976${phone}`, channel: 'sms' });

    console.log('Twilio verification response:', verification);
    res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    console.error('Detailed Twilio error:', error);
    res.status(500).json({
      message: 'Failed to send OTP',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
