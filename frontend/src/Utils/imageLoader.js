// Image loader utility for Next.js
// This helps with image imports from src/assets

export const getImagePath = (imageImport) => {
  // If it's already a string (public path), return as is
  if (typeof imageImport === 'string') {
    return imageImport;
  }
  
  // If it's an imported image object, return the src
  if (imageImport && imageImport.src) {
    return imageImport.src;
  }
  
  // If it's a default export
  if (imageImport && typeof imageImport === 'object' && imageImport.default) {
    return imageImport.default.src || imageImport.default;
  }
  
  // Fallback
  return imageImport;
};

// Helper to convert imported images to usable paths
export const imageSrc = (imageImport) => {
  if (!imageImport) return '';
  
  // Handle string paths (already public paths)
  if (typeof imageImport === 'string') {
    return imageImport.startsWith('/') ? imageImport : `/${imageImport}`;
  }
  
  // Handle webpack imported images
  if (typeof imageImport === 'object') {
    return imageImport.src || imageImport.default?.src || imageImport.default || imageImport;
  }
  
  return imageImport;
};





