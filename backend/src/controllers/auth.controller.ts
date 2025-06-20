import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { StringValue } from 'ms';
import { getUserByEmail, createUser, getUserById } from '../types/user/user.modal';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as StringValue;

export const register: RequestHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      // 1. Invia la risposta
      res.status(400).json({ success: false, message: 'Username, email e password sono obbligatori.' });
      // 2. Esci dalla funzione
      return;
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ success: false, message: 'Email già registrata.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await createUser(username, email, hashedPassword);

    // Quando è l'ultima istruzione, non serve nemmeno il return finale
    res.status(201).json({ success: true, message: 'Utente registrato con successo.' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Errore interno del server.' });
  }
};


// Interfaccia per il corpo della richiesta di login
interface LoginBody {
  email: string;
  password: string;
}

export const login: RequestHandler<{}, any, LoginBody> = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email e password sono obbligatorie.' });
      return; // Uscita anticipata
    }

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Credenziali errate.' });
      return; // Uscita anticipata
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Credenziali errate.' });
      return; // Uscita anticipata
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.is_admin, userName: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie('accessToken', token, {
      httpOnly: true, // Il cookie non è accessibile da script lato client
      secure: process.env.STATUS_RELEASE === 'production', // Invia solo tramite HTTPS in produzione
      sameSite: 'strict', // Protezione robusta contro attacchi CSRF
      maxAge: 60 * 60 * 1000 // Scadenza del cookie in millisecondi (es. 1 ora)
    });

    const userPayload = {
      id: user.id,
      name: user.username,
      isAdmin: user.is_admin
    };

    // Invia la risposta finale
    res.status(200).json({ success: true, message: 'Login effettuato con successo.', user: userPayload });
    return;

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Errore interno del server.' });
  }
};


export const me: RequestHandler = async (req, res) => {
  try {
    // Accesso sicuro a req.userId grazie al file di dichiarazione dei tipi
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ message: 'Utente non autenticato.' });
      return; // Uscita anticipata
    }

    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ message: 'Utente non trovato.' });
      return; // Uscita anticipata
    }

    // Invia la risposta finale con i dati dell'utente
    res.status(200).json({ success: true, user: user });

  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ message: 'Errore interno del server.' });
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    // Ordiniamo al browser di cancellare il cookie 'accessToken'.
    // Per farlo, lo sovrascriviamo con un cookie vuoto e una data di scadenza passata.
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: process.env.STATUS_RELEASE === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Data di scadenza nel passato, che lo invalida immediatamente
    });

    // Invia una risposta di successo.
    res.status(200).json({ success: true, message: 'Logout effettuato con successo.' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Errore interno del server durante il logout.' });
  }
};