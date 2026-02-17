/**
 * Get WebP image path with fallback
 * Returns WebP path if available, otherwise returns original path
 */
export const getWebPImagePath = (originalPath: string): string => {
  // Check if path already has an extension
  const extMatch = originalPath.match(/\.(png|jpg|jpeg)$/i);
  if (!extMatch) return originalPath;
  
  const ext = extMatch[1].toLowerCase();
  const basePath = originalPath.replace(/\.(png|jpg|jpeg)$/i, '');
  
  // For hero-carousel and image_carousel, WebP files are in webp/ subfolder
  if (originalPath.includes('/hero-carousel/') || originalPath.includes('/image_carousel/')) {
    const folderPath = basePath.substring(0, basePath.lastIndexOf('/'));
    const fileName = basePath.substring(basePath.lastIndexOf('/') + 1);
    return `${folderPath}/webp/${fileName}.webp`;
  }
  
  // For flow folder, WebP files are in webp/ subfolder
  if (originalPath.includes('/flow/')) {
    const folderPath = basePath.substring(0, basePath.lastIndexOf('/'));
    const fileName = basePath.substring(basePath.lastIndexOf('/') + 1);
    return `${folderPath}/webp/${fileName}.webp`;
  }
  
  // Default: replace extension with .webp
  return `${basePath}.webp`;
};

/**
 * Get original image path (fallback)
 */
export const getOriginalImagePath = (path: string): string => {
  return path;
};
