import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request type to include a user property
interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Get token from the Authorization header (format: "Bearer <token>")
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if token is provided
  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? 'your_jwt_secret'
    ) as { id: string; role: string };

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('JWT verification error:', error); // Log the error for debugging
    res.status(401).json({ message: 'Token is not valid' });
  }
};
