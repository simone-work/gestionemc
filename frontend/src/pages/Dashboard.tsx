import React from 'react';
import { Stack, Image, Text, ThemeProvider } from '@fluentui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

import { dashboardTheme } from '../themes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

// Importiamo tutti i componenti necessari
import UserMenu from '../components/UserMenu';
import UserProfileCard from '../components/UserProfileCard';
import AdBanner from '../components/AdBanner'; // <-- Importiamo il nuovo componente

const Dashboard = () => {
  const { user } = useAuth();

  // Stile per il layout principale a due colonne
  const mainContentStyles = {
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: '24px',
      padding: '24px',
      // Su schermi piccoli, le colonne vanno una sopra l'altra
      '@media (max-width: 1024px)': {
        flexDirection: 'column',
      },
    }
  };

  return (
    <ThemeProvider theme={dashboardTheme}>

      <Stack styles={{ root: { minHeight: '100vh', backgroundColor: '#0f172a' } }}>
        {/* HEADER (invariato) */}
        <Stack as="header" horizontal verticalAlign="center" styles={{ root: { backgroundColor: '#1e293b', padding: '10px 20px' } }}>
          <Stack.Item grow={1}>
            <RouterLink to="/dashboard" style={{ textDecoration: 'none' }}>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
                <Image src="/mythictales_logo.png" alt="Mythic Tales Logo" width={50} height={50} />
                <Text variant='xxLarge'>Mythic Tales</Text>
              </Stack>
            </RouterLink>
          </Stack.Item>
          <Stack.Item>
            <UserMenu />
          </Stack.Item>
        </Stack>

        {/* CONTENUTO PRINCIPALE A DUE COLONNE */}
        <Stack.Item grow={1} styles={mainContentStyles}>

          {/* Colonna Sinistra (Area Rossa) - Occupa lo spazio necessario */}
          <Stack.Item grow={5} styles={{ root: { display: 'flex', alignItems: 'center', justifyContent: 'center' } }}>
            {user?.isAdmin ? (
              <Text variant="xxLarge">Benvenuto, Amministratore!</Text>
            ) : (
              <UserProfileCard />
            )}
          </Stack.Item>

          {/* Colonna Destra (Area Blu) - Occupa lo spazio rimanente */}
          <Stack.Item grow={1} styles={{ root: { minWidth: '300px' } }}>
            <AdBanner />
          </Stack.Item>

        </Stack.Item>


        {/* --- FOOTER --- */}
        <Stack
          as="footer"
          verticalAlign='center'
          horizontalAlign="center"
          tokens={{ childrenGap: 8 }}
          styles={{ root: { padding: '20px', color: 'white', backgroundColor: '#1e293b' } }}
        >
          <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
            <a href='https://discord.gg/SS8VkYqsJU' title='Discord' style={{ color: 'white' }} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faDiscord} size="1x" />
            </a>
            <a href='https://www.instagram.com/mcmythictales/' title='Instagram' style={{ color: 'white' }} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} size="1x" />
            </a>
            <a href='https://www.tiktok.com/@mythic_tales?lang=it-IT' title='TikTok' style={{ color: 'white' }} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTiktok} size="1x" />
            </a>
            <a href='https://wiki.mythictales.it/' title='Wiki' style={{ color: 'white' }} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGlobe} size="1x" />
            </a>
          </Stack>
          <Text style={{ color: 'white' }} >© 2025 Mythic Tales. Tutti i diritti riservati.</Text>
        </Stack>
      </Stack>
    </ThemeProvider>

  );
};

export default Dashboard;