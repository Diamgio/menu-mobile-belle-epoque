
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker, checkForAppInstallation } from './pwa/registerSW';

// Explicitly attach React to window for debugging purposes
if (typeof window !== 'undefined') {
  window.React = React;
  console.log("React attached to window:", !!window.React);
}

console.log("React version:", React.version);
console.log("Initializing React application");

// Register service worker for PWA functionality
registerServiceWorker();

// Check if the app can be installed
checkForAppInstallation();

// Get the root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found");
} else {
  try {
    // Create root and render the app
    const root = createRoot(rootElement);
    
    // Render the app - use the explicit React import
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log("React app initialized successfully");
  } catch (error) {
    console.error("Error initializing React:", error);
  }
}
