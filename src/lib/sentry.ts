/**
 * Sentry Frontend Error Monitoring
 * GitHub Student Developer Pack: sentry.io — 50,000 errors/month free
 * 
 * SETUP: Add VITE_SENTRY_DSN to your Doppler / .env:
 *   VITE_SENTRY_DSN=https://xxxxx@o0.ingest.sentry.io/xxxxxxx
 */
import * as Sentry from "@sentry/react";

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  // Skip in development if DSN not set
  if (!dsn) {
    console.info("ℹ️  Sentry DSN not set — error monitoring disabled in dev mode.");
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE || "production",
    release: "dpsi-website@1.0.0",

    // Session Replay: record 10% of sessions, 100% of sessions with errors
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Performance tracing: 10% of transactions sampled
    tracesSampleRate: 0.1,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Custom tag to identify the school tenant
    initialScope: {
      tags: {
        platform: "dpsi-website",
        tenant: typeof window !== "undefined"
          ? (localStorage.getItem("dpsi_admin_tenant") || "dpsi")
          : "dpsi",
      },
    },
  });
}

/**
 * Manually capture and report a handled error to Sentry.
 * Use this for non-fatal errors you want to track (e.g. failed API calls).
 */
export function captureError(error: unknown, context?: Record<string, string>) {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, val]) => scope.setTag(key, val));
    }
    Sentry.captureException(error);
  });
}

export { Sentry };
