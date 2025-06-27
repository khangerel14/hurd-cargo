import { Twilio } from 'twilio';
import { env } from '../config/env';

const accountSid = env.TWILIO_ACCOUNT_SID;
const authToken = env.TWILIO_AUTH_TOKEN;
export const verifySid = env.TWILIO_VERIFY_SERVICE_SID;

export const twilioClient = new Twilio(accountSid, authToken);
