
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Explicitly define React globally to ensure it's available
window.React = React;

console.log("React version:", React.version);
console.log("Initializing React application");

// Get the root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found");
} else {
  try {
    // Create root and render the app
    const root = createRoot(rootElement);
    
    // Render the app
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
