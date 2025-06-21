import { useState, useCallback } from 'react';
import { compressImages, CompressionResult, shouldCompressImage, formatFileSize } from '../utils/imageCompression';
import { useNotificationHelpers } from '../contexts/NotificationContext';

interface CompressionProgress {
  isCompressing: boolean;
  progress: number;
  current: number;
  total: number;
  results: CompressionResult[];
}

interface UseImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxFileSize?: number;
  format?: 'jpeg' | 'webp' | 'png';
  autoCompress?: boolean;
  showNotifications?: boolean;
}

const DEFAULT_OPTIONS: UseImageCompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  maxFileSize: 2 * 1024 * 1024, // 2MB
  format: 'jpeg',
  autoCompress: true,
  showNotifications: true,
};

export const useImageCompression = (options: UseImageCompressionOptions = {}) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { showSuccess, showError, showInfo } = useNotificationHelpers();
  
  const [compressionState, setCompressionState] = useState<CompressionProgress>({
    isCompressing: false,
    progress: 0,
    current: 0,
    total: 0,
    results: [],
  });

  const compressFiles = useCallback(async (files: File[]): Promise<File[]> => {
    if (!files.length) return files;

    // Check which files need compression
    const filesToCompress = files.filter(file => shouldCompressImage(file));
    
    if (!filesToCompress.length) {
      if (opts.showNotifications) {
        showInfo('No images need compression');
      }
      return files;
    }

    setCompressionState({
      isCompressing: true,
      progress: 0,
      current: 0,
      total: filesToCompress.length,
      results: [],
    });

    try {
      if (opts.showNotifications) {
        showInfo(`Compressing ${filesToCompress.length} image${filesToCompress.length > 1 ? 's' : ''}...`);
      }

      const results = await compressImages(
        files,
        {
          maxWidth: opts.maxWidth,
          maxHeight: opts.maxHeight,
          quality: opts.quality,
          maxFileSize: opts.maxFileSize,
          format: opts.format,
        },
        (progress, current, total) => {
          setCompressionState(prev => ({
            ...prev,
            progress,
            current,
            total,
          }));
        }
      );

      setCompressionState(prev => ({
        ...prev,
        isCompressing: false,
        results,
      }));

      // Calculate total savings
      const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
      const totalCompressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0);
      const totalSavings = totalOriginalSize - totalCompressedSize;
      const savingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);

      if (opts.showNotifications && totalSavings > 0) {
        showSuccess(
          `Images compressed successfully! Saved ${formatFileSize(totalSavings)} (${savingsPercent}%)`
        );
      }

      return results.map(r => r.file);
    } catch (error) {
      setCompressionState(prev => ({
        ...prev,
        isCompressing: false,
      }));

      if (opts.showNotifications) {
        showError('Failed to compress images. Using original files.');
      }
      
      console.error('Image compression failed:', error);
      return files; // Return original files if compression fails
    }
  }, [opts, showSuccess, showError, showInfo]);

  const resetCompression = useCallback(() => {
    setCompressionState({
      isCompressing: false,
      progress: 0,
      current: 0,
      total: 0,
      results: [],
    });
  }, []);

  const getCompressionStats = useCallback(() => {
    const { results } = compressionState;
    if (!results.length) return null;

    const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalCompressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0);
    const totalSavings = totalOriginalSize - totalCompressedSize;
    const averageCompression = results.reduce((sum, r) => sum + r.compressionRatio, 0) / results.length;

    return {
      totalFiles: results.length,
      originalSize: formatFileSize(totalOriginalSize),
      compressedSize: formatFileSize(totalCompressedSize),
      totalSavings: formatFileSize(totalSavings),
      averageCompression: averageCompression.toFixed(1),
      results,
    };
  }, [compressionState.results]);

  return {
    ...compressionState,
    compressFiles,
    resetCompression,
    getCompressionStats,
    canCompress: (files: File[]) => files.some(shouldCompressImage),
  };
};