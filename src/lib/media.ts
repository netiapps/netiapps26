/**
 * Resolves a media path to a full URL.
 * When NEXT_PUBLIC_MEDIA_BASE_URL is set (e.g. DigitalOcean Space CDN), assets are served from there.
 * Otherwise the path is used as-is (local /public).
 */
const baseUrl =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_MEDIA_BASE_URL
    ? process.env.NEXT_PUBLIC_MEDIA_BASE_URL.replace(/\/$/, "")
    : "https://netiapps-2026-website.sgp1.cdn.digitaloceanspaces.com";

const WP_UPLOADS_MARKER = "/wp-content/uploads/";

export function getMediaUrl(path: string): string;
export function getMediaUrl(path?: string | null): string | undefined;
export function getMediaUrl(path?: string | null): string | undefined {
  if (!path) return path ?? undefined;

  // WordPress (ACF) returns absolute URLs built from its own siteurl, which can
  // point at whatever domain WP is configured with. Re-home any WP uploads URL
  // onto the CDN instead of trusting that domain.
  if (/^https?:\/\//i.test(path)) {
    const idx = path.indexOf(WP_UPLOADS_MARKER);
    if (idx === -1) return path;
    return `${baseUrl}${path.slice(idx)}`;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return baseUrl ? `${baseUrl}${normalized}` : normalized;
}
