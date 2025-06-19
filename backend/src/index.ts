import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import { checkOrigin } from './middleware/origin.middleware';
import { userValidationRules } from './middleware/validationMiddleware';

// Carica le variabili da .env
dotenv.config();

const app = express();

// Middleware CORS con controllo Origin
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === process.env.ALLOWED_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error('Origin non autorizzato'));
    }
  },
  credentials: true,
}));

// Middleware per parsing JSON
app.use(express.json());

// Middleware per parsing dei cookie
app.use(cookieParser());

// Middleware custom per validare Origin anche lato backend
app.use(checkOrigin);

// Registra le rotte (autenticazione per ora)
app.use('/api/auth', authRoutes);

// Porta dal file .env o default
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
