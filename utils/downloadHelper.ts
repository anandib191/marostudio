import { toast } from 'react-toastify';

const S3_BUCKET_HOST = 'growspace-app-storage.s3.eu-north-1.amazonaws.com';

/**
 * Converts an S3 URL to a proxied URL that avoids CORS issues.
 * e.g. https://growspace-app-storage.s3.eu-north-1.amazonaws.com/marostudio/foo.png
 *   -> /s3-proxy/marostudio/foo.png
 */
export function getProxiedUrl(url: string): string {
  if (!url) return url;
  // Only proxy S3 bucket URLs
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
    const fetchUrl = getProxiedUrl(imageUrl);
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    
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
    toast.error('Failed to download image');
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
    const fetchUrl = getProxiedUrl(videoUrl);
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
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
    toast.error('Failed to download video');
  }
};

/**
 * Fetches a remote image as a Blob (proxying S3 URLs).
 * Used by ZIP export to fetch images for packaging.
 */
export const fetchImageAsBlob = async (imageUrl: string): Promise<Blob> => {
  const fetchUrl = getProxiedUrl(imageUrl);
  const response = await fetch(fetchUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.blob();
};
