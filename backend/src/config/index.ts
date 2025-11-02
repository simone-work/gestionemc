export { default as db } from './database';


// =================================================================
// File: src/@types/express.d.ts
// Scopo: Estendere i tipi di Express con le nostre proprietà custom.
// Questo file permette a TypeScript di capire cosa sono `req.userId` e `req.isAdmin`
// dopo che il nostro middleware `authenticateToken` li ha aggiunti.
// =================================================================

// Dichiariamo al compilatore TypeScript che vogliamo aggiungere delle proprietà
// all'interfaccia Request globale del modulo 'express-serve-static-core'.
declare module 'express-serve-static-core' {
  interface Request {
    // Aggiungiamo le nostre proprietà opzionali.
    // Sono opzionali perché esistono solo DOPO l'esecuzione del middleware.
    userId?: number;
    isAdmin?: boolean;
  }
}