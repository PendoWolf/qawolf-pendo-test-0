import { useEffect, useState } from "react";
import { api, type AppState } from "./api";

// Seam for Pendo. Novus installs the Pendo agent, which provides window.pendo
// at runtime; this fires a Track Event for each action. No-op when the agent
// isn't present (local dev), so the app and Playwright mocks both stay simple.
function trackEvent(name: string) {
  if (typeof window !== "undefined") {
    window.pendo?.track?.(`demo-${name}`);
  }
}

export default function App() {
  const [state, setState] = useState<AppState>({ counter: 0, lastAction: "none" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (name: string, fn: () => Promise<AppState>) => {
    try {
      setError(null);
      setLoading(true);
      setState(await fn());
      trackEvent(name);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    run("load", api.getState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      style={{ fontFamily: "system-ui, sans-serif", maxWidth: 480, margin: "4rem auto", textAlign: "center" }}
      aria-label="QAWolf Demo application"
    >
      <h1>QAWolf Demo</h1>

      <p
        data-testid="counter-value"
        aria-label={`Counter value: ${state.counter}`}
        aria-live="polite"
        style={{ fontSize: "3rem", margin: "1rem 0" }}
      >
        {state.counter}
      </p>
      <p
        data-testid="last-action"
        aria-live="polite"
        style={{ color: "#666" }}
      >
        Last action: {state.lastAction}
      </p>

      {/* [CRITICAL] Loading indicator: users had no feedback during async operations */}
      {loading && (
        <p
          role="status"
          aria-label="Loading"
          style={{ color: "#888", fontSize: "0.875rem", marginBottom: 8 }}
        >
          Loading…
        </p>
      )}

      <div
        role="group"
        aria-label="Counter controls"
        style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}
      >
        {/* [CRITICAL] Buttons disabled during requests to prevent duplicate submissions */}
        <button
          data-testid="btn-increment"
          disabled={loading}
          aria-disabled={loading}
          onClick={() => run("increment", api.increment)}
        >
          Increment
        </button>
        <button
          data-testid="btn-decrement"
          disabled={loading}
          aria-disabled={loading}
          onClick={() => run("decrement", api.decrement)}
        >
          Decrement
        </button>
        <button
          data-testid="btn-reset"
          disabled={loading}
          aria-disabled={loading}
          onClick={() => run("reset", api.reset)}
        >
          Reset
        </button>
        <button
          data-testid="btn-refresh"
          disabled={loading}
          aria-disabled={loading}
          onClick={() => run("refresh", api.getState)}
        >
          Refresh
        </button>
      </div>

      {/* [CRITICAL] Error now announced to screen readers via role="alert" */}
      {error && (
        <p
          data-testid="error"
          role="alert"
          aria-live="assertive"
          style={{ color: "crimson", marginTop: 16 }}
        >
          {error}
        </p>
      )}
    </main>
  );
}
