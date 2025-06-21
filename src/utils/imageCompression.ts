export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxFileSize?: number; // in bytes
  format?: 'jpeg' | 'webp' | 'png';
  maintainAspectRatio?: boolean;
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  dimensions: {
    width: number;
    height: number;
  };
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  maxFileSize: 2 * 1024 * 1024, // 2MB
  format: 'jpeg',
  maintainAspectRatio: true,
};

/**
 * Compresses an image file using Canvas API
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas 2D context not supported'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions
      const { width: newWidth, height: newHeight } = calculateDimensions(
        img.width,
        img.height,
        opts.maxWidth,
        opts.maxHeight,
        opts.maintainAspectRatio
      );

      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw and compress image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          // Create new file
          const compressedFile = new File(
            [blob],
            generateCompressedFileName(file.name, opts.format),
            {
              type: `image/${opts.format}`,
              lastModified: Date.now(),
            }
          );

          const result: CompressionResult = {
            file: compressedFile,
            originalSize: file.size,
            compressedSize: blob.size,
            compressionRatio: ((file.size - blob.size) / file.size) * 100,
            dimensions: {
              width: newWidth,
              height: newHeight,
            },
          };

          // Check if we need further compression
          if (blob.size > opts.maxFileSize && opts.quality > 0.1) {
            // Recursive compression with lower quality
            compressImage(file, { ...opts, quality: opts.quality * 0.8 })
              .then(resolve)
              .catch(reject);
          } else {
            resolve(result);
          }
        },
        `image/${opts.format}`,
        opts.quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate optimal dimensions maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio: boolean
): { width: number; height: number } {
  if (!maintainAspectRatio) {
    return {
      width: Math.min(originalWidth, maxWidth),
      height: Math.min(originalHeight, maxHeight),
    };
  }

  const aspectRatio = originalWidth / originalHeight;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  // Scale down if necessary
  if (newWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }

  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  };
}

/**
 * Generate compressed file name
 */
function generateCompressedFileName(originalName: string, format: string): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const timestamp = Date.now();
  return `${nameWithoutExt}_compressed_${timestamp}.${format}`;
}

/**
 * Check if file needs compression
 */
export function shouldCompressImage(file: File, maxSize: number = 1024 * 1024): boolean {
  return file.size > maxSize || file.type === 'image/png' || file.type === 'image/bmp';
}

/**
 * Get image dimensions without loading full image
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Batch compress multiple images
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (progress: number, current: number, total: number) => void
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      if (shouldCompressImage(file)) {
        const result = await compressImage(file, options);
        results.push(result);
      } else {
        // File doesn't need compression
        results.push({
          file,
          originalSize: file.size,
          compressedSize: file.size,
          compressionRatio: 0,
          dimensions: await getImageDimensions(file),
        });
      }
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error);
      // Keep original file if compression fails
      results.push({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
        dimensions: { width: 0, height: 0 },
      });
    }

    // Report progress
    onProgress?.(((i + 1) / files.length) * 100, i + 1, files.length);
  }

  return results;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}