import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, PrimaryButton, Stack, Spinner, Text } from '@fluentui/react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

const Register = () => {
  // Stato per i campi del form di registrazione
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Stato per la UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const auth = useAuth();

  const handleRegister = async () => {
    // Validazione frontend di base
    if (password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Chiamiamo il nuovo endpoint di registrazione
      // Il backend dovrebbe creare l'utente, impostare il cookie HttpOnly
      // e restituire i dati del nuovo utente, loggandolo automaticamente.
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password
      });

      // Estraiamo l'utente dalla risposta
      const { user } = response.data;

      // Usiamo la stessa funzione di login del contesto per impostare lo stato globale
      auth.login(user);

      // Reindirizziamo l'utente alla dashboard, dato che è stato loggato
      navigate('/dashboard');

    } catch (err: any) {
      // Gestiamo errori specifici dal backend (es. "Email già in uso")
      setError(err.response?.data?.message || 'Errore durante la registrazione.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack
      tokens={{ childrenGap: 15 }}
      styles={{ root: { width: 300, margin: '100px auto', padding: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } }}
    >
      <h2 style={{ textAlign: 'center', margin: 0 }}>Registrati</h2>
      
      <TextField
        label="Nome"
        value={name}
        onChange={(_, v) => setName(v || '')}
        disabled={isLoading}
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(_, v) => setEmail(v || '')}
        disabled={isLoading}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(_, v) => setPassword(v || '')}
        disabled={isLoading}
      />
      <TextField
        label="Conferma Password"
        type="password"
        value={confirmPassword}
        onChange={(_, v) => setConfirmPassword(v || '')}
        disabled={isLoading}
      />

      {error && (
        <Text styles={{ root: { color: '#a80000', textAlign: 'center' } }}>
          {error}
        </Text>
      )}

      <PrimaryButton
        text={isLoading ? 'Registrazione in corso...' : 'Registrati'}
        onClick={handleRegister}
        disabled={isLoading || !email || !password || !name}
      />

      {isLoading && <Spinner label="Creazione account in corso..." />}

      <Text styles={{ root: { textAlign: 'center', marginTop: 10 } }}>
        Hai già un account? <Link to="/login">Accedi</Link>
      </Text>
    </Stack>
  );
};

export default Register;