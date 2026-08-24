/**
 * Indian Standard Time (IST, UTC+5:30) Utility functions
 * Ensures consistent Asia/Kolkata date, time, and timestamp formatting across the DPSI application.
 */

export const IST_TIMEZONE = "Asia/Kolkata";
export const IST_LOCALE = "en-IN";

/**
 * Formats a date into Indian Standard Time (e.g., "24 Aug 2026")
 */
export function formatISTDate(
  date: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";

  return new Intl.DateTimeFormat(IST_LOCALE, {
    timeZone: IST_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(d);
}

/**
 * Formats a date and time into Indian Standard Time (e.g., "24 Aug 2026, 04:35 PM IST")
 */
export function formatISTDateTime(
  date: string | number | Date | null | undefined,
  includeSeconds = false
): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";

  const formatted = new Intl.DateTimeFormat(IST_LOCALE, {
    timeZone: IST_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined,
    hour12: true,
  }).format(d);

  return `${formatted} IST`;
}

/**
 * Formats a date in standard Indian numerical format (DD/MM/YYYY)
 */
export function formatISTDateNumeric(date: string | number | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";

  return new Intl.DateTimeFormat(IST_LOCALE, {
    timeZone: IST_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Formats relative time from now in IST (e.g., "5 mins ago", "2 hours ago", "Yesterday")
 */
export function formatISTRelativeTime(date: string | number | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return formatISTDate(d);
}

/**
 * Gets the current timestamp in IST as an ISO-compatible string representation
 */
export function getNowInIST(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: IST_TIMEZONE }));
}
