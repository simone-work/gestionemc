import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carica le variabili d'ambiente per accedere alle credenziali del DB
dotenv.config();

// Creiamo un pool di connessioni. Il pool gestisce più connessioni
// contemporaneamente, riutilizzandole invece di aprirne e chiuderne una
// nuova per ogni query. Questo è molto più performante.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Attende se tutte le connessioni sono in uso
  connectionLimit: 10,      // Numero massimo di connessioni nel pool
  queueLimit: 0             // Nessun limite alla coda di attesa
});

// Messaggio per confermare che la connessione è stata stabilita con successo
pool.getConnection()
  .then(connection => {
    console.log('🔗 Connessione al database MySQL stabilita con successo.');
    connection.release(); // Rilascia subito la connessione per non sprecarla
  })
  .catch(err => {
    console.error('❌ Errore durante la connessione al database:', err);
  });

// Esportiamo il pool per poterlo usare nei nostri servizi (es. user.service.ts)
export default pool;
