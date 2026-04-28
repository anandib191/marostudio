import { toast } from 'react-toastify';

const S3_BUCKET_HOST = 'growspace-app-storage.s3.eu-north-1.amazonaws.com';

/**
 * Converts an S3 URL to a proxied URL that avoids CORS issues.
 * Used for displaying images in <img> tags (no CORS issue) — only proxies in DEV.
 * e.g. https://growspace-app-storage.s3.eu-north-1.amazonaws.com/marostudio/foo.png
 *   -> /s3-proxy/marostudio/foo.png
 */
export function getProxiedUrl(url: string): string {
  if (!url) return url;
  // Proxy S3 bucket URLs ONLY in development environment for <img> display
  // In production, <img> tags can load S3 URLs directly (no CORS restriction)
  if (import.meta.env.DEV && url.includes(S3_BUCKET_HOST)) {
    const path = url.split(S3_BUCKET_HOST)[1]; // e.g. /marostudio/2026-04-07/abc.png
    return `/s3-proxy${path}`;
  }
  return url;
}

/**
 * Converts an S3 URL to a proxied URL for fetch/download operations.
 * ALWAYS proxies S3 URLs regardless of environment, because fetch() is
 * subject to CORS restrictions even in production.
 * Without this, production downloads return index.html (8.6KB) instead of the actual image.
 */
function getDownloadProxiedUrl(url: string): string {
  if (!url) return url;
  if (url.includes(S3_BUCKET_HOST)) {
    const path = url.split(S3_BUCKET_HOST)[1]; // e.g. /marostudio/2026-04-07/abc.png
    return `/s3-proxy${path}`;
  }
  return url;
}

/**
 * Downloads an image from any URL (S3, data URL, or other).
 * Automatically proxies S3 URLs to avoid CORS.
 */
export const downloadImage = async (
  imageUrl: string,
  fileName: string
): Promise<void> => {
  if (!imageUrl) return;

  try {
    // For data URLs, download directly without fetch
    if (imageUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Downloaded successfully!', { position: 'top-right', autoClose: 2000 });
      return;
    }

    const fetchUrl = getDownloadProxiedUrl(imageUrl);
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentType = response.headers.get('content-type') || '';
    // Guard: if the response is HTML instead of an image, the proxy/CORS failed
    if (contentType.includes('text/html')) {
      console.error('Download returned HTML instead of image. Content-Type:', contentType);
      throw new Error('Download failed: received HTML instead of image data');
    }

    const blob = await response.blob();

    // Sanity check: images should be larger than 10KB typically
    if (blob.size < 1024 && !contentType.includes('svg')) {
      console.warn('Downloaded blob is suspiciously small:', blob.size, 'bytes');
    }
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Downloaded successfully!', { position: 'top-right', autoClose: 2000 });
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: open the image in a new tab so user can right-click → Save As
    try {
      window.open(imageUrl, '_blank');
      toast.info('Opening image in new tab. Right-click → Save As to download.', {
        position: 'top-right',
        autoClose: 5000,
      });
    } catch {
      toast.error('Failed to download image. Please try right-clicking the image and selecting "Save As".');
    }
  }
};

/**
 * Downloads a video from any URL.
 */
export const downloadVideo = async (
  videoUrl: string,
  fileName: string
): Promise<void> => {
  if (!videoUrl) return;

  try {
    const fetchUrl = getDownloadProxiedUrl(videoUrl);
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Download failed: received HTML instead of video data');
    }

    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Video downloaded successfully!', { position: 'top-right', autoClose: 2000 });
  } catch (error) {
    console.error('Video download failed:', error);
    try {
      window.open(videoUrl, '_blank');
      toast.info('Opening video in new tab. Right-click → Save As to download.', {
        position: 'top-right',
        autoClose: 5000,
      });
    } catch {
      toast.error('Failed to download video');
    }
  }
};

/**
 * Fetches a remote image as a Blob (proxying S3 URLs).
 * Used by ZIP export to fetch images for packaging.
 */
export const fetchImageAsBlob = async (imageUrl: string): Promise<Blob> => {
  const fetchUrl = getDownloadProxiedUrl(imageUrl);
  const response = await fetch(fetchUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.blob();
};
