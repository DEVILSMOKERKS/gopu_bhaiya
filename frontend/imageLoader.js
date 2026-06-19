/**
 * Custom image loader.
 * Bypasses Next.js optimization for:
 * - Inline/local previews (`data:` / `blob:`)
 * - Absolute remote URLs
 * - Backend-uploaded asset paths like `/products/...`
 * - Next.js static assets
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const BACKEND_BASE_URL = API_URL.replace(/\/api\/?$/, '');
const BACKEND_UPLOAD_PREFIXES = [
  '/profile/',
  '/blogs/',
  '/categories/',
  '/subcategories/',
  '/products/',
  '/reviews/',
];

export default function imageLoader({ src, width, quality }) {
  if (typeof src !== 'string' || !src) {
    return src;
  }

  const normalizedSrc = src.trim();
  const isInlinePreview =
    normalizedSrc.startsWith('data:') || normalizedSrc.startsWith('blob:');
  const isAbsoluteUrl =
    normalizedSrc.startsWith('http://') || normalizedSrc.startsWith('https://');
  const isStaticAsset = normalizedSrc.startsWith('/_next/static/');
  const isBackendUpload =
    BACKEND_BASE_URL &&
    BACKEND_UPLOAD_PREFIXES.some((prefix) => normalizedSrc.startsWith(prefix));

  if (isInlinePreview || isAbsoluteUrl || isStaticAsset) {
    return normalizedSrc;
  }

  if (isBackendUpload) {
    return `${BACKEND_BASE_URL}${normalizedSrc}`;
  }

  return `/_next/image?url=${encodeURIComponent(normalizedSrc)}&w=${width}&q=${quality || 75}`;
}
