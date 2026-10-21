import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/ada/tokens.css';
import './styles/ada/base.css';
import './styles/ada/components.css';
import './styles/grupal.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
