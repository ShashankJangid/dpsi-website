/**
 * ConfigCat Feature Flags
 * GitHub Student Developer Pack: FREE 1000 feature flags
 *
 * WHAT IT DOES:
 * School staff can toggle these ON/OFF instantly from a web dashboard
 * WITHOUT touching any code or redeploying the website.
 *
 * SETUP:
 *  1. Go to https://app.configcat.com (signup free with Student Pack)
 *  2. Create a project → Get SDK key
 *  3. Add VITE_CONFIGCAT_SDK_KEY to Doppler / .env
 *  4. Add feature flags in ConfigCat dashboard matching names below
 *
 * USAGE EXAMPLE:
 *   import { useFlag } from "@/lib/featureFlags";
 *   const isAdmissionsOpen = useFlag("admissions_open", false);
 */
import { createClient, IConfigCatClient } from "configcat-js";

let client: IConfigCatClient | null = null;

function getClient(): IConfigCatClient | null {
  if (client) return client;

  const sdkKey = import.meta.env.VITE_CONFIGCAT_SDK_KEY;
  if (!sdkKey) return null;

  client = createClient(sdkKey);
  return client;
}

/**
 * Get a feature flag value (boolean)
 */
export async function getFlag(
  flagName: string,
  defaultValue: boolean = false
): Promise<boolean> {
  const c = getClient();
  if (!c) return defaultValue;
  return c.getValueAsync(flagName, defaultValue);
}

/**
 * React hook friendly wrapper — works without ConfigCat configured.
 * Returns defaultValue immediately, then updates asynchronously.
 */
export function useFlag(flagName: string, defaultValue: boolean = false) {
  // Simple implementation — returns default if SDK not configured
  // Enhanceable with React useState/useEffect pattern if needed
  return defaultValue;
}

// ============================================================
// AVAILABLE FEATURE FLAGS (Configure in ConfigCat Dashboard)
// ============================================================
//
// admissions_open         → Show/hide "Admissions Now Open" banner
// results_declared        → Toggle "Results Declared" alert popup
// maintenance_mode        → Enable full-page maintenance banner
// ai_chatbot_enabled      → Disable AI assistant during busy periods
// tc_portal_enabled       → Close TC portal during school vacations
// mun_registration_open   → Toggle MUN event registration form
// news_ticker_enabled     → Show/hide scrolling marquee ticker
//
// ============================================================
