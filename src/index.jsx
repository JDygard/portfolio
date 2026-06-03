import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';

const rootEl = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// In production the root already contains server-rendered markup, so hydrate it.
// In `vite` dev the root is empty, so mount normally. This keeps `npm start`
// working without a hydration warning.
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
