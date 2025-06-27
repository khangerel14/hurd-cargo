import { UserPayload } from '../../src/middlewares/auth';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
