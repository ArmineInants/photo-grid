import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initPerformanceMonitoring } from './utils/performance'

// Initialize performance monitoring
initPerformanceMonitoring();

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
