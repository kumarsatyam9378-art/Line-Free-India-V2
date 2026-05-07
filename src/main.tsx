import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './components/ToastSystem';
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { registerServiceWorker, startUpdateChecker } from './utils/updateChecker';

// Register service worker for auto-updates
registerServiceWorker();

// Start checking for updates
startUpdateChecker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);
