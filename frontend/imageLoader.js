/**
 * Custom image loader. For backend URLs (localhost:5000) we skip Next.js
 * image optimization so the browser loads the image directly. This avoids
 * "upstream response is invalid" when the backend has filenames with spaces
 * or the optimizer has trouble fetching from localhost.
 */
export default function imageLoader({ src, width, quality }) {
  const isBackendUrl =
    typeof src === 'string' &&
    (src.startsWith('http://localhost:5000') || src.startsWith('http://127.0.0.1:5000'));

  if (isBackendUrl) {
    return src;
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
