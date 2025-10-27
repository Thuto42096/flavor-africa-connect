/**
 * Image Compression Utility
 * Compresses images before upload to reduce file size while maintaining quality
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1, default 0.8
  maxSizeMB?: number; // Maximum file size in MB
}

export interface CompressionResult {
  base64: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  maxSizeMB: 5,
};

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64: string): Blob {
  const parts = base64.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(parts[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * Get image dimensions from base64 string
 */
function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = base64;
  });
}

/**
 * Calculate new dimensions maintaining aspect ratio
 */
function calculateNewDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  return { width, height };
}

/**
 * Compress image using canvas
 */
function compressImageOnCanvas(
  base64: string,
  width: number,
  height: number,
  quality: number
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = width;
  canvas.height = height;

  const img = new Image();
  img.src = base64;

  ctx.drawImage(img, 0, 0, width, height);

  // Determine image type from original base64
  const mimeType = base64.includes('image/png') ? 'image/png' : 'image/jpeg';

  return canvas.toDataURL(mimeType, quality);
}

/**
 * Get file size in MB from base64 string
 */
function getBase64SizeInMB(base64: string): number {
  const blob = base64ToBlob(base64);
  return blob.size / (1024 * 1024);
}

/**
 * Main compression function
 */
export async function compressImage(
  base64: string,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Get original size
    const originalSize = getBase64SizeInMB(base64);

    // Get original dimensions
    const { width: originalWidth, height: originalHeight } = await getImageDimensions(base64);

    // Calculate new dimensions
    const { width: newWidth, height: newHeight } = calculateNewDimensions(
      originalWidth,
      originalHeight,
      opts.maxWidth || 1200,
      opts.maxHeight || 1200
    );

    // Compress on canvas
    let compressedBase64 = compressImageOnCanvas(base64, newWidth, newHeight, opts.quality || 0.8);

    // If still too large, reduce quality further
    let quality = opts.quality || 0.8;
    let attempts = 0;
    const maxAttempts = 5;

    while (getBase64SizeInMB(compressedBase64) > (opts.maxSizeMB || 5) && attempts < maxAttempts) {
      quality -= 0.1;
      compressedBase64 = compressImageOnCanvas(base64, newWidth, newHeight, quality);
      attempts++;
    }

    const compressedSize = getBase64SizeInMB(compressedBase64);
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    return {
      base64: compressedBase64,
      originalSize,
      compressedSize,
      compressionRatio,
      width: newWidth,
      height: newHeight,
    };
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error('Failed to compress image');
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(sizeInMB: number): string {
  if (sizeInMB < 0.001) {
    return `${(sizeInMB * 1024 * 1024).toFixed(0)} B`;
  }
  if (sizeInMB < 1) {
    return `${(sizeInMB * 1024).toFixed(2)} KB`;
  }
  return `${sizeInMB.toFixed(2)} MB`;
}

