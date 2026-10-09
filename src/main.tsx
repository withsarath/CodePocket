import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

/**
 * Application Entry Point
 *
 * 1. Finds the `<div id="root"></div>` element inside `index.html`.
 * 2. Creates a React root using `createRoot`.
 * 3. Mounts the main `<App />` component inside `<StrictMode>` (which highlights
 *    potential problems and bad practices during development).
 */
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

