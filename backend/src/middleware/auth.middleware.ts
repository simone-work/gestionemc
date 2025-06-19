import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
  id: number;
  isAdmin: boolean;
  userName: string;
}

export const authenticateToken = (
  req: Request & { userId?: number; isAdmin?: boolean; userName?: string },
  res: Response,
  next: NextFunction
) => {
  // Leggi il token dal cookie invece che dall'header
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ success: false, message: 'Token mancante. Accesso non autorizzato.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    req.userName = decoded.userName;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token non valido' });
    return;
  }
};

