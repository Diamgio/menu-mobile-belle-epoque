
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Script to prevent theme flash
const themeScript = `
  (function() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('restaurant-menu-theme');
    if (storedTheme === 'dark' || (storedTheme === 'system' && prefersDark) || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })()
`;

// Create script element and inject the theme script
const themeScriptTag = document.createElement('script');
themeScriptTag.innerHTML = themeScript;
document.head.appendChild(themeScriptTag);

const rootElement = document.getElementById("root");

// Add safeguard to check if root element exists
if (!rootElement) {
  console.error("Root element not found");
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
