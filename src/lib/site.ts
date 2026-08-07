/**
 * Canonical origin for the site.
 *
 * Backs `metadataBase` and the absolute URLs in share links, so getting this
 * wrong means Open Graph previews and share buttons point at localhost.
 *
 * Resolution order:
 *  1. `NEXT_PUBLIC_SITE_URL` — set this once a custom domain is live.
 *  2. The Vercel production domain, so canonical and share URLs point at
 *     production even when rendered from a preview deployment.
 *  3. The per-deployment Vercel URL, for previews before a project domain
 *     exists.
 *  4. localhost, for local development.
 *
 * Every consumer renders on the server, so the unprefixed Vercel variables
 * are readable here without exposing them to the browser.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;

  return 'http://localhost:3000';
}

export const siteUrl = resolveSiteUrl();

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
