import db from '../config/database'; // La tua connessione al DB (es. pool mysql2)

interface DiscordUserData {
  discordId: string;
  username: string;
  avatar: string;
}

// Questa funzione usa query parametrizzate per prevenire SQL Injection
export const findOrCreateUserByDiscordId = async (userData: DiscordUserData) => {
  const { discordId, username, avatar } = userData;
  const connection = await db.getConnection();
  try {
    // Cerca l'utente
    const [rows]: any = await connection.execute('SELECT * FROM users WHERE discord_id = ?', [discordId]);
    
    if (rows.length > 0) {
      // Utente trovato, restituiscilo
      return rows[0];
    } else {
      // Utente non trovato, crealo
      const [result]: any = await connection.execute(
        'INSERT INTO users (discord_id, username, avatar_hash) VALUES (?, ?, ?)',
        [discordId, username, avatar]
      );
      // Restituisci il nuovo utente
      const [newUserRows]: any = await connection.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      return newUserRows[0];
    }
  } finally {
    connection.release();
  }
};

export const getUserById = async (id: number) => {
  const connection = await db.getConnection();
  try {
    const [rows]: any = await connection.execute(
      'SELECT id, username, discord_id, avatar_hash FROM users WHERE id = ?',
      [id]
    );
    // Restituiamo solo il primo risultato, o null se non trovato
    return rows.length > 0 ? rows[0] : null;
  } finally {
    connection.release();
  }
};