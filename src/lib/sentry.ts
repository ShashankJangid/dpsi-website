/**
 * Sentry Frontend Error Monitoring
 * Organisation: orangefuturetech
 * Project:      javascript-react-router
 * DSN:          https://08fc42b0aa8123348987d264d2c88b99@o4511965668179968.ingest.us.sentry.io/4511965673029632
 */
import * as Sentry from "@sentry/react";

// Your Sentry DSN — safe to be public (it only accepts errors FROM your site)
const SENTRY_DSN =
  import.meta.env.VITE_SENTRY_DSN ||
  "https://08fc42b0aa8123348987d264d2c88b99@o4511965668179968.ingest.us.sentry.io/4511965673029632";

export function initSentry() {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE || "production",
    release: "dpsi-website@1.0.0",

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Capture 10% of all page transactions for performance monitoring
    tracesSampleRate: import.meta.env.DEV ? 0 : 0.1,

    // Record 10% of user sessions, 100% of sessions with errors
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Filter out noisy, non-actionable browser errors
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection captured",
      /^Network Error$/,
      /^Failed to fetch$/,
      /^Load failed$/,
    ],

    // Tag every error with the active school/client tenant
    initialScope: {
      tags: {
        platform: "dpsi-website",
        org: "orangefuturetech",
        tenant:
          typeof window !== "undefined"
            ? localStorage.getItem("dpsi_admin_tenant") || "dpsi"
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
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, val]) => scope.setTag(key, val));
    }
    Sentry.captureException(error);
  });
}

export { Sentry };
