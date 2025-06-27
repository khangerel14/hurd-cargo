// src/routers/auth.router.ts
import express from 'express';
import { sendOTP } from '../controllers/auth/sendOtp';
import { verifyOTP } from '../controllers/auth/verifyOtp';
import { resetPassword } from '../controllers/auth/resetPassword';

const router = express.Router();

// Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

export default router;
