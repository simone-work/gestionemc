import { RequestHandler } from 'express';
import axios from 'axios';
import { findOrCreateUserByDiscordId, getUserById } from '../services/user.service';
import dotenv from 'dotenv';
import { signJwt } from '../utils/jwt.utils';
import { AppError } from '../utils/error.handler';

dotenv.config();

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URL,
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  FRONT_URL,
} = process.env;

// 1. Reindirizza l'utente alla pagina di autorizzazione di Discord
export const discordLoginRedirect: RequestHandler = (req, res) => {
  // 1. Definiamo l'URL di base senza parametri
  const baseUrl = 'https://discord.com/api/oauth2/authorize';

  // 2. Creiamo un oggetto con tutti i parametri che vogliamo aggiungere
  const params = {
    client_id: DISCORD_CLIENT_ID!, // Il '!' dice a TypeScript: "Fidati, so che questo valore non è nullo"
    redirect_uri: DISCORD_REDIRECT_URL!,
    response_type: 'code',
    scope: 'identify', // URLSearchParams gestirà la codifica dello spazio (%20) per noi
  };

  // 3. Usiamo URLSearchParams per costruire la stringa di query in modo sicuro
  const queryString = new URLSearchParams(params).toString();

  // 4. Uniamo l'URL di base e la stringa di query generata
  const discordAuthUrl = `${baseUrl}?${queryString}`;

  // Stampa l'URL finale per un facile debug (opzionale)
  console.log('Redirecting to:', discordAuthUrl);

  // 5. Eseguiamo il reindirizzamento
  res.redirect(discordAuthUrl);
};

// 2. Gestisce il callback da Discord
export const discordCallback: RequestHandler = async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    throw new AppError('Codice di autorizzazione mancante.', 400);
  }

  try {
    // Fase 1: Scambia il codice per un access token di Discord
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: DISCORD_CLIENT_ID!,
      client_secret: DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: DISCORD_REDIRECT_URL!,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const accessToken = tokenResponse.data.access_token;

    // Fase 2: Ottieni i dati dell'utente da Discord (invariata)
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const discordUser = userResponse.data;

    // --- NUOVA FASE DI VERIFICA ---
    // Fase 3: Usiamo il nostro BOT TOKEN per verificare se l'utente è nel nostro server
    try {
      // Facciamo una chiamata all'API di Discord per ottenere i dettagli di un membro specifico del nostro server
      await axios.get(
        `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${discordUser.id}`,
        {
          headers: {
            // Usiamo il token del BOT, non quello dell'utente!
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          },
        }
      );
      // Se questa chiamata ha successo (non lancia un errore 404), significa che l'utente è nel server.
    } catch (guildError: any) {
      // Se l'errore è un 404, significa "Membro non trovato".
      if (guildError.response && guildError.response.status === 404) {
        console.log(`L'utente ${discordUser.username} ha tentato di fare il login ma non è nel server.`);
        // Reindirizziamo a una pagina di errore sul frontend
        return res.redirect(`${FRONT_URL}/?error=not_in_server`);
      }
      // Per altri errori, li consideriamo errori del server
      throw guildError;
    }

    // Fase 4: Cerca o crea l'utente nel NOSTRO database (invariata)
    // Cerca o crea un utente nel nostro database
    // Questo è un punto CRUCIALE per la sicurezza e l'astrazione
    const user = await findOrCreateUserByDiscordId({
      discordId: discordUser.id,
      username: discordUser.username,
      avatar: discordUser.avatar,
    });

    const payload = { id: user.id, discordId: user.discord_id };

    // Fase 5: Crea il NOSTRO JWT (invariata)
    // Crea il NOSTRO JWT per la nostra applicazione
    const token = signJwt(payload);

    // Fase 6: Imposta il cookie e reindirizza (invariata)
    // Imposta il JWT in un cookie sicuro
    res.cookie('accessToken', token, {
      httpOnly: true, // Impedisce accesso da JS (sicurezza XSS)
      secure: process.env.NODE_ENV === 'production', // Solo su HTTPS
      sameSite: 'strict', // Protezione CSRF
      maxAge: 45 * 60 * 1000, // 1 ora
    });

    // Reindirizza l'utente alla dashboard del frontend
    res.redirect(`${FRONT_URL}/dashboard`);

  } catch (error) {
    console.error("Errore durante l'autenticazione con Discord:", error);
    res.status(500).redirect(`${FRONT_URL}/?error=auth_failed`);
    return;
  }
};

// 3. Logout
export const logout: RequestHandler = (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0), // Invalida il cookie
  });
  res.status(200).json({ success: true, message: "Logout effettuato." });
  return;
};

// 4. Check Status (`/me`)
export const checkAuthStatus: RequestHandler = async (req, res) => {
  // Se arriviamo qui, il middleware ha già validato il token e aggiunto req.userId.
  const userId = req.userId;

  if (!userId) { throw new AppError('ID utente non presente nel token.', 401); }
  const user = await getUserById(userId);

  if (!user) {
    // Questo potrebbe succedere se l'utente è stato cancellato ma il token è ancora valido
    throw new AppError(`Utente non trovato`, 404);
  }

  // Creiamo un payload pulito da inviare, senza dati sensibili come la password (anche se non c'è)
  const userPayload = {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatar_hash
      ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar_hash}.png`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discord_id) % 5}.png`
  };

  // Invia i dati utente "freschi" al frontend
  res.status(200).json({
    success: true,
    user: userPayload,
  });

};