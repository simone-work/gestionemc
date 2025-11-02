import { RequestHandler } from 'express';
import {verifyJwt} from '../utils/jwt.utils';
import { AppError } from '../utils/error.handler';

interface JwtPayload {
  id: number;
  discordId: string; 
}

export const authenticateToken: RequestHandler = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new AppError('Accesso negato. Token mancante.', 401);
  }

  try {
    const decoded = verifyJwt(token) as JwtPayload;
    // Estendiamo l'oggetto Request per passare i dati al prossimo handler
    (req as any).userId = decoded.id;
    (req as any).isDiscordId = decoded.discordId;
    next();
    return;
  } catch (err) {
    throw new AppError('Token non valido o scaduto', 403);
  }
};