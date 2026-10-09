import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app/App';
import { AppErrorBoundary } from './app/AppErrorBoundary';
import '@fontsource-variable/inter/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

// G01/G02/G10: punto de entrada. React se monta en el <div id="root"> de index.html.
// StrictMode (sólo en desarrollo) ejecuta los Effects dos veces para detectar Effects sin cleanup.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
);
