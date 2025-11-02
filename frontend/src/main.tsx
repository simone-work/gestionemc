import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importa solo la configurazione per Font Awesome
import { initializeIcons } from '@fluentui/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

initializeIcons();

// Dice alla libreria di non aggiungere automaticamente il CSS, perché lo stiamo importando noi manualmente.
config.autoAddCss = false;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
