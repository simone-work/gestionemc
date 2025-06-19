import { pool } from '../../config/db'; // Cambiato da db a pool

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  is_admin: boolean;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  const result = rows as User[];
  return result.length > 0 ? result[0] : null;
}

export async function createUser(username: string, email: string, hashedPassword: string): Promise<void> {
  await pool.execute(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );
}

export async function getUserById(id: number): Promise<User | null> {
  const [rows] = await pool.execute('SELECT id, username, email, is_admin FROM users WHERE id = ?', [id]);
  const result = rows as User[];
  return result.length > 0 ? result[0] : null;
}
