/**
 * Canonical origin for the site.
 *
 * Used for `metadataBase` and for building absolute share URLs. Set
 * NEXT_PUBLIC_SITE_URL in the deployment environment; the localhost default
 * only keeps local development working.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
