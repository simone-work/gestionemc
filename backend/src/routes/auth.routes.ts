import express from 'express';
import {
  discordLoginRedirect,
  discordCallback,
  logout,
  checkAuthStatus,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// --- Flusso OAuth2 di Discord ---
// 1. Il frontend reindirizza l'utente a questo endpoint per iniziare
router.get('/discord', discordLoginRedirect);
// 2. Discord reindirizza l'utente qui dopo l'autorizzazione
router.get('/discord/callback', discordCallback);

// --- Gestione Sessione ---
// 3. Endpoint per il logout (elimina il cookie)
router.post('/logout', logout);
// 4. Endpoint protetto per verificare se il token è ancora valido
router.get('/me', authenticateToken, checkAuthStatus);

export default router;
