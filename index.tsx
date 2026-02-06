import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  registerSW({ 
    immediate: true,
    onNeedRefresh() {
       // Automatic refresh is enabled, but we could prompt user here
       console.log("New content available, refreshing...");
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);