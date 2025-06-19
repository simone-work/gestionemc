import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; // Importa Link
import { TextField, PrimaryButton, Stack, Spinner, Text } from '@fluentui/react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

const Login = () => {
  // ... (tutto il codice precedente rimane invariato) ...
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const auth = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      auth.login(response.data.user);
      return <Navigate to="/dashboard" replace />;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenziali non valide o errore di connessione.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Stack 
      tokens={{ childrenGap: 15 }} 
      styles={{ root: { width: 300, margin: '100px auto', padding: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } }}
    >
      <h2 style={{ textAlign: 'center', margin: 0 }}>Login</h2>
      
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
        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleLogin()}
      />
      
      {error && (
        <Text styles={{ root: { color: '#a80000', textAlign: 'center' } }}>
          {error}
        </Text>
      )}

      <PrimaryButton 
        text={isLoading ? 'Accesso in corso...' : 'Accedi'} 
        onClick={handleLogin} 
        disabled={isLoading || !email || !password}
      />
      
      {isLoading && <Spinner label="Verifica in corso..." />}

      {/* --- NUOVA AGGIUNTA QUI --- */}
      <Text styles={{ root: { textAlign: 'center', marginTop: 10 } }}>
        Non hai un account? <Link to="/register">Registrati</Link>
      </Text>
      {/* --------------------------- */}
    </Stack>
  );
};

export default Login;