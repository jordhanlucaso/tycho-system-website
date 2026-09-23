/**
 * Analytics shim.
 *
 * Deliberately thin: the template does not ship a vendor. Point this at whatever the
 * client already runs — GA4, Plausible, Fathom, PostHog — by filling in the branch that
 * matches. Until then it pushes to `window.dataLayer` if a tag manager is present and
 * logs in development, so `lead_submit` is observable from day one.
 */
type TrackPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props: TrackPayload }) => void;
  }
}

export function track(event: string, payload: TrackPayload = {}): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...payload });
  }

  if (typeof window.plausible === "function") {
    window.plausible(event, { props: payload });
  }

  if (process.env.NODE_ENV === "development") {
    console.info(`[track] ${event}`, payload);
  }
}
