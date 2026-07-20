import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './AuthContext.tsx';

// Catch and suppress HMR websocket-related errors that bubble up from Vite
window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = event.reason?.message || String(event.reason);
  if (reasonStr && (
    reasonStr.includes('WebSocket') || 
    reasonStr.includes('websocket') || 
    reasonStr.includes('Vite') ||
    reasonStr.includes('vite') ||
    reasonStr.includes('connection')
  )) {
    event.preventDefault();
    event.stopPropagation();
  }
});

window.addEventListener('error', (event) => {
  const msg = event.message || '';
  if (msg && (
    msg.includes('WebSocket') || 
    msg.includes('websocket') || 
    msg.includes('Vite') ||
    msg.includes('vite') ||
    msg.includes('connection')
  )) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('The width(-1) and height(-1) of chart should be greater than 0')) {
    return;
  }
  originalWarn(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
