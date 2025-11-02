import jwt from 'jsonwebtoken';
import type { StringValue } from "ms";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as StringValue;

interface JwtPayload {
    id: number;
    discordId: string; 
}

/**
 * Firma un payload e crea un JWT.
 * @param payload - L'oggetto da inserire nel token (es. { id, isAdmin }).
 * @returns Il token JWT firmato come stringa.
 */
export const signJwt = (payload: JwtPayload): string => {
    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN, }
    );
};

/**
 * Verifica un token JWT.
 * @param token - Il token da verificare.
 * @returns Il payload decodificato se il token è valido, altrimenti null.
 */
export const verifyJwt = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        // Se jwt.verify lancia un errore (es. token scaduto o non valido), restituiamo null.
        console.error("Errore durante la verifica del JWT:", error);
        return null;
    }
};

