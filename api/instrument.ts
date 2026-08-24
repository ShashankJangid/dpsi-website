/**
 * Sentry Backend Instrumentation — Node.js (Hono)
 * MUST be imported before all other modules in api/boot.ts
 *
 * Platform:     Node.js (ESM) + Hono
 * Organisation: orangefuturetech
 * DSN:          same project as frontend
 */
import * as Sentry from "@sentry/node";

const SENTRY_DSN =
  process.env.SENTRY_DSN ||
  "https://4af9b9eba8a785eebe4a2f825c232e87@o4511965668179968.ingest.us.sentry.io/4511965680304128";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV || "production",
  release: "dpsi-api@1.0.0",

  // 100% in dev, 10% in production for performance spans
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Capture local variable values in stack frames (Node.js)
  includeLocalVariables: true,

  // Enable structured logging API (Sentry.logger.*)
  enableLogs: true,

  // Capture Node.js memory/CPU/event-loop metrics every 30s
  integrations: [
    Sentry.nodeRuntimeMetricsIntegration(),
  ],
});

export { Sentry };
export { captureException, captureMessage, withScope } from "@sentry/node";
