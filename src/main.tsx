
import React from 'react';  // Aggiunto import esplicito di React
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Utilizziamo React.StrictMode per avvolgere l'App
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
