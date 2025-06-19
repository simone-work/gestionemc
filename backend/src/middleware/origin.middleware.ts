import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Carica le variabili da .env
dotenv.config();


export function checkOrigin(req: Request, res: Response, next: NextFunction) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  const requestOrigin = req.headers.origin;

  if (!requestOrigin || requestOrigin === allowedOrigin) {
    return next(); // OK
  }

  console.warn(`❌ Richiesta bloccata da origin non autorizzato: ${requestOrigin}`);
  res.status(403).json({ message: 'Origin non autorizzato' });
  return;
}
// Middleware per validare l'origin delle richieste
// Questo middleware verifica che l'origin della richiesta sia quello del frontend autorizzato