import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import '@stellar-drive-signet/visualiser/tokens.css';
import '@stellar-drive-signet/visualiser/interactive/details.css';
import '@stellar-drive-signet/visualiser/interactive/keyboard.css';
import '@stellar-drive-signet/visualiser/interactive/viewport.css';
import './styles.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
