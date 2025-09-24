// src/index.js
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Progressive enhancement: add a "js" hook to the <html> tag
document.documentElement.classList.add("js");

// Simple, resilient error boundary so the app doesn't go blank on runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Helpful for debugging; swap for a logger if you add one later
    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, maxWidth: 800, margin: "40px auto" }}>
          <h1>Something went wrong</h1>
          <p className="muted">
            {String(this.state.error ?? "Unknown error")}
          </p>
          <p className="muted">Try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Gracefully handle missing #root (rare, but nice to guard)
const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error('Missing <div id="root"></div> in index.html');
}

const root = createRoot(rootEl);
root.render(
  <React.StrictMode>
    {/* Suspense keeps things tidy if you add code-splitting/lazy routes */}
    <Suspense fallback={<p className="muted" style={{ padding: 24 }}>Loading…</p>}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Suspense>
  </React.StrictMode>
);

/* PWA: if/when you add a service worker file (e.g., /service-worker.js), uncomment:
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((err) => {
      console.error("SW registration failed:", err);
    });
  });
}
*/
