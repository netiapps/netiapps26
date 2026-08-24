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

// Rewrites the string onto the CDN only if it's already an absolute WP
// uploads URL; any other string (relative or not) is returned untouched.
function rewriteIfWpUploadsUrl(value: string): string {
  if (!/^https?:\/\//i.test(value)) return value;
  const idx = value.indexOf(WP_UPLOADS_MARKER);
  if (idx === -1) return value;
  return `${baseUrl}${value.slice(idx)}`;
}

export function getMediaUrl(path: string): string;
export function getMediaUrl(path?: string | null): string | undefined;
export function getMediaUrl(path?: string | null): string | undefined {
  if (!path) return path ?? undefined;

  // WordPress (ACF) returns absolute URLs built from its own siteurl, which can
  // point at whatever domain WP is configured with. Re-home any WP uploads URL
  // onto the CDN instead of trusting that domain.
  if (/^https?:\/\//i.test(path)) {
    return rewriteIfWpUploadsUrl(path);
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return baseUrl ? `${baseUrl}${normalized}` : normalized;
}

/**
 * Recursively rewrites every absolute WP uploads URL found anywhere in a
 * fetched WordPress/ACF payload onto the CDN, leaving every other string
 * (titles, descriptions, relative paths, numeric fields, ...) untouched.
 * Applying this once at the fetch boundary means individual components
 * never need to remember to call getMediaUrl themselves for nested/indirect
 * fields. This must NOT use getMediaUrl's relative-path fallback, since that
 * fallback is only safe when a developer explicitly knows a field is a media
 * path — applied blindly to arbitrary content it would corrupt plain text.
 */
export function normalizeWpMediaUrls<T>(data: T): T {
  if (typeof data === "string") {
    return rewriteIfWpUploadsUrl(data) as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => normalizeWpMediaUrls(item)) as unknown as T;
  }
  if (data && typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      result[key] = normalizeWpMediaUrls(value);
    }
    return result as T;
  }
  return data;
}
