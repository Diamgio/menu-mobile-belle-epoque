
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure React is properly initialized before using it
// Get the root element directly
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found");
} else {
  // Create root and render the app
  const root = createRoot(rootElement);
  
  // Inject React into the global scope to ensure it's available everywhere
  window.React = React;
  
  // Render the app with StrictMode to catch potential issues
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log("React app initialized successfully");
}
