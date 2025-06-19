// src/pages/Dashboard.tsx (Versione Migliorata)
import { PrimaryButton, Stack, Text } from '@fluentui/react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom'; // Importiamo useNavigate qui!

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // Usiamo l'hook qui, nel componente UI

  const handleLogout = async () => {
    await logout(); // 1. Esegui la logica di logout (chiamata API e pulizia stato)
    // 2. DOPO che il logout è completato, naviga
    navigate('/home');
  };

  return (
    <Stack tokens={{ childrenGap: 15 }} styles={{ root: { padding: 20 } }}>
      <h1>Dashboard</h1>
      {user && (
        <Text variant="large">
          Benvenuto, <strong>{user.name}</strong>!
        </Text>
      )}
      <Text>Questa è un'area protetta del sito.</Text>
      <PrimaryButton text="Logout" onClick={handleLogout} styles={{ root: { width: 100 } }} />
    </Stack>
  );
};

export default Dashboard;