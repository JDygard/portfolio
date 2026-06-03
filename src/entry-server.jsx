import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

// Renders the app to a static HTML string. CSS is emitted by Vite as a real
// stylesheet (linked from <head>), so there's nothing to collect or inline
// here — the prerender script only needs the markup.
export function render() {
  const html = renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  return { html };
}
