import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import 'express-async-error';

// Importa le tue rotte
import authRoutes from './routes/auth.routes';
import { globalErrorHandler } from './utils/error.handler';

// Carica le variabili d'ambiente dal file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARE DI SICUREZZA ---
// 1. Helmet: Imposta vari header HTTP per la sicurezza
app.use(helmet());

// 2. CORS: Controlla quali origini possono accedere alla tua API
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Accetta richieste solo dal tuo frontend
  credentials: true, // Permette l'invio dei cookie
};
app.use(cors(corsOptions));

// 3. Cookie Parser: Per leggere i cookie dalle richieste in arrivo
app.use(cookieParser());

// 4. Body Parser: Per leggere i body delle richieste POST in formato JSON
app.use(express.json());

// --- ROUTING ---
app.use('/api/auth', authRoutes);

// --- GESTIONE ERRORI ---

// Handler per rotte non trovate (404)
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint non trovato.' 
  });
});

// Error handler globale (IMPORTATO dal file dedicato)
app.use(globalErrorHandler);



// Avvio del server
app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
});
