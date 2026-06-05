import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

const rootEl = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// In production the root contains prerendered element markup, so hydrate it.
// In `vite` dev it only contains the SSG placeholder comment, so mount normally.
if (rootEl.firstElementChild) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
