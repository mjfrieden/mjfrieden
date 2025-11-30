import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth/authService';

export interface AuthenticatedRequest extends Request {
  user?: { sub: string; email: string };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Missing auth header' });
  }
  const [, token] = header.split(' ');
  try {
    req.user = verifyToken(token);
    next();
  } catch (err: any) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
