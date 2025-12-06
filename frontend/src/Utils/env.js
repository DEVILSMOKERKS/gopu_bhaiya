// Environment variable helper for Next.js compatibility
export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL
  }
  // Server-side
  return process.env.NEXT_PUBLIC_API_URL
};




