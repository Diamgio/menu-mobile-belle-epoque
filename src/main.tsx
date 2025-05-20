
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Explicitly ensure React is defined globally
window.React = React;

console.log("Initializing React application");

// Get the root element immediately without any delay
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found");
} else {
  // Create root and render the app immediately
  const root = createRoot(rootElement);
  
  // Render without any delay
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log("React app initialized successfully");
}
