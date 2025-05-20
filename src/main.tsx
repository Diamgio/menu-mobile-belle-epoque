
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make sure React is initialized first
console.log("Initializing React application");

// Get the root element immediately without any delay
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found");
} else {
  // Create root and render the app immediately
  const root = createRoot(rootElement);
  
  // Make sure React is defined globally to avoid multiple instances
  window.React = React;
  
  // Render without any delay
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log("React app initialized successfully");
}
