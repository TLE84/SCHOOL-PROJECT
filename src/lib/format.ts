/**
 * Date helpers.
 *
 * Locale and time zone are pinned so the server and the browser always produce
 * the same string — an unpinned `toLocaleDateString` renders differently on
 * each and trips React's hydration check.
 */

const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const TIME = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  minute: '2-digit',
  // `hour12: true` on en-GB selects the h11 cycle, which renders noon as
  // "0:00 pm". h12 is the 1–12 cycle that reads correctly.
  hourCycle: 'h12',
  timeZone: 'UTC',
});

const MONTH_SHORT = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' });
const DAY = new Intl.DateTimeFormat('en-GB', { day: 'numeric', timeZone: 'UTC' });

/** e.g. "15 May 2024" */
export function formatDate(iso: string): string {
  return DATE.format(new Date(iso));
}

/** e.g. "10:00 am – 1:00 pm", or just the start time when there is no end. */
export function formatTimeRange(startIso: string, endIso?: string): string {
  const start = TIME.format(new Date(startIso));
  return endIso ? `${start} – ${TIME.format(new Date(endIso))}` : start;
}

/** The stacked date block on event cards. */
export function formatDateBlock(iso: string): { month: string; day: string } {
  const date = new Date(iso);
  return { month: MONTH_SHORT.format(date), day: DAY.format(date) };
}
