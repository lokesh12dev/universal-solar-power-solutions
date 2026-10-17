/**
 * Tiny analytics abstraction. Event names only — NEVER send names, phone
 * numbers, emails, or free-text to any analytics platform.
 * No-op until NEXT_PUBLIC_ANALYTICS_ID is set and a dataLayer exists.
 */
export type AnalyticsEvent =
  | "quote_cta_click"
  | "phone_click"
  | "email_click"
  | "lead_form_start"
  | "lead_form_submit"
  | "lead_form_success"
  | "lead_form_fail"
  | "planner_start"
  | "planner_complete"
  | "consultation_request"
  | "calculator_completed"
  | "service_request_submitted"
  | "project_case_study_viewed";

const queue: { event: AnalyticsEvent; page: string }[] = [];

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const entry = { event, page: window.location.pathname };
  queue.push(entry);
  const w = window as unknown as { dataLayer?: unknown[] };
  if (process.env.NEXT_PUBLIC_ANALYTICS_ID && Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, page_path: entry.page });
  }
}

/** In-memory queue (for tests + debugging how many events fired). */
export function trackedEvents(): { event: AnalyticsEvent; page: string }[] {
  return [...queue];
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ID);
}
