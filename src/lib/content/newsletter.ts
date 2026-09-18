/**
 * In-memory newsletter sign-ups for the demo.
 *
 * Emails live for the life of the running server, like the rest of the
 * seed-backed demo state. Real delivery/persistence arrives with the backend.
 */

const subscribers = new Set<string>();

export function subscribeEmail(email: string): { alreadySubscribed: boolean } {
  const normalized = email.trim().toLowerCase();
  const alreadySubscribed = subscribers.has(normalized);
  subscribers.add(normalized);
  return { alreadySubscribed };
}

export function subscriberCount(): number {
  return subscribers.size;
}
