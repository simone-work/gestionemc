import { PrimaryButton, Stack, Text } from '@fluentui/react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom'; 

const Dashboard = () => {
  const { user, logout } = useAuth();
    const navigate = useNavigate();


  const handleLogout = async () => {
    navigate('/', { replace: true }); // 1. Reindirizza l'utente alla home page per prevenire che [ProtectedRoute] lo reindirizzi al login
    await logout(); // 2. Esegui la logica di logout (chiamata API e pulizia stato)
  };

  return (
    <Stack tokens={{ childrenGap: 15 }} styles={{ root: { padding: 20 } }}>
      <h1>Dashboard</h1>
      {user && (
        <Text variant="large">
          Benvenuto, <strong>{user.username}</strong>!
        </Text>
      )}
      <Text>Questa è un'area protetta del sito.</Text>
      <PrimaryButton text="Logout" onClick={handleLogout} styles={{ root: { width: 100 } }} />
    </Stack>
  );
};

export default Dashboard;