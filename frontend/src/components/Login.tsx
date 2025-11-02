import React from 'react';
import { PrimaryButton, Stack, Text } from '@fluentui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';


const Login = () => {

  const handleDiscordLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/discord';
  };

  return (

    <Stack
      styles={{
        root: {
          backgroundColor: '#1e293b',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          height: '35vh',
          maxWidth: '350px',
        }
      }}
    >
      <Text as="h1" variant="xxLarge" styles={{ root: { margin: 0, color: 'white' } }}>
        Accedi a <br />
        Mythic Tales
      </Text>

      <PrimaryButton
        onClick={handleDiscordLogin}
        styles={{
          root: {
            backgroundColor: '#5865F2',
            borderColor: '#5865F2',
            height: '44px',
            fontSize: '16px',
            borderRadius: '10px',
            marginBottom: '-20%',
          },
          rootHovered: {
            backgroundColor: '#4752C4',
            borderColor: '#4752C4',
          },
          rootPressed: {
            backgroundColor: '#3C45A5'
          }
        }}
      >

        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }} style={{ color: 'white', fontWeight: 'bold' }}>
          <FontAwesomeIcon icon={faDiscord} size="lg" />
          <span>Accedi con Discord</span>
        </Stack>

      </PrimaryButton>

      <Text as="p" variant="medium" styles={{ root: { color: '#cbd5e1' } }}>
        Accedi rapidamente con il tuo account Discord per unirti all'avventura!
      </Text>

    </Stack>
  );
}

export default Login;
