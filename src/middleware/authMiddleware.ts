import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Agar token bo'lmasa, demo/guest rejimi uchun davom etishga ruxsat beramiz
    req.userId = 'demo_user_id';
    req.userRole = 'engineer';
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'termoplan_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret) as { userId: string; role: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Yaroqsiz yoki eskirgan avtorizatsiya tokeni' });
  }
};
