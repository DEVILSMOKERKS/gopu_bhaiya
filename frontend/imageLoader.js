/**
 * Custom image loader. Skips Next.js image optimization for:
 * - Backend URLs (localhost:5000) - avoids "upstream response is invalid"
 * - Next.js static assets (/_next/static/) - avoids 404 when optimizer can't resolve them
 */
export default function imageLoader({ src, width, quality }) {
  const isBackendUrl =
    typeof src === 'string' &&
    (src.startsWith('http://localhost:5000') || src.startsWith('http://127.0.0.1:5000'));

  const isStaticAsset = typeof src === 'string' && src.startsWith('/_next/static/');

  if (isBackendUrl || isStaticAsset) {
    return src;
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
