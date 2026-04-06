// Patch Node prototype for DOM error handling
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  (Node.prototype as any).removeChild = function(child: any) {
    if (child.parentNode !== this) {
      if (console) {
        console.error('Cannot remove a child from a different parent', child, this);
      }
      return child;
    }
    return originalRemoveChild.call(this, child);
  }

  const originalInsertBefore = Node.prototype.insertBefore;
  (Node.prototype as any).insertBefore = function(newNode: any, referenceNode: any) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) {
        console.error('Cannot insert before a reference node from a different parent', referenceNode, this);
      }
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  }
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as Sentry from "@sentry/react";
// Sentry Setup
Sentry.init({
  dsn: "https://c17e68a8b8855d05711edded10a64543@o4508009410854912.ingest.us.sentry.io/4508241583013888",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.extraErrorDataIntegration(),
  ],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/qtozlukrkvmcjdfkrstp.supabase.co/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = document.getElementById("root");
createRoot(root!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
