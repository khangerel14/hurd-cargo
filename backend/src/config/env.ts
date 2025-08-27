import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hurd-cargo',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID || '',
};
