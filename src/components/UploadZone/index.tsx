import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useImageCompression } from '../../hooks/useImageCompression';
import { CompressionProgress } from '../CompressionProgress';
import './UploadZone.scss';

type Props = {
  onFileSelect: (file: File) => void;
  onMultipleFilesSelect?: (files: File[]) => void;
  uploading?: boolean;
  enableCompression?: boolean;
};

export const UploadZone = ({
  onFileSelect,
  onMultipleFilesSelect,
  uploading = false,
  enableCompression = true,
}: Props) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image compression hook
  const { isCompressing, progress, current, total, compressFiles, canCompress } =
    useImageCompression({
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      maxFileSize: 2 * 1024 * 1024, // 2MB
      format: 'jpeg',
      showNotifications: true,
    });

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      await processFiles(filesArray);
    }
  };

  const processFiles = async (files: File[]) => {
    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Please select image files only');
      return;
    }

    if (imageFiles.length !== files.length) {
      alert(`${files.length - imageFiles.length} non-image files were ignored`);
    }

    // Compress images if enabled and needed
    let processedFiles = imageFiles;
    if (enableCompression && canCompress(imageFiles)) {
      processedFiles = await compressFiles(imageFiles);
    }

    setSelectedFiles(processedFiles);

    // Handle single vs multiple files
    if (processedFiles.length === 1) {
      onFileSelect(processedFiles[0]);
    } else if (onMultipleFilesSelect) {
      onMultipleFilesSelect(processedFiles);
    } else {
      // If no multiple files handler, select first file
      onFileSelect(processedFiles[0]);
    }
  };

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div
        className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${uploading || isCompressing ? 'uploading' : ''} ${selectedFiles.length > 0 ? 'has-file' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        <div className='upload-content'>
          {uploading ? (
            <>
              <div className='upload-spinner'></div>
              <h3>Uploading your photo...</h3>
              <p>Please wait while we process your image</p>
            </>
          ) : selectedFiles.length > 0 ? (
            <>
              <div className='files-preview'>
                <div className='files-summary'>
                  <div className='file-icon'>📷</div>
                  <div className='files-info'>
                    <h4>
                      {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} selected
                    </h4>
                    <p>
                      Total:{' '}
                      {(selectedFiles.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)}{' '}
                      MB
                    </p>
                    {enableCompression && canCompress(selectedFiles) && (
                      <small className='compression-hint'>
                        🗜️ Images will be compressed for optimal performance
                      </small>
                    )}
                  </div>
                  <button
                    className='remove-file'
                    onClick={handleRemoveFiles}
                    aria-label='Remove files'
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p className='upload-hint'>Click to upload or drag new images to replace</p>
            </>
          ) : (
            <>
              <div className='upload-icon'>
                <svg
                  width='64'
                  height='64'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M14.2639 15.9375L12.5958 14.2834C12.2668 13.9583 11.7332 13.9583 11.4042 14.2834L9.73608 15.9375C9.13137 16.5339 9.56201 17.5625 10.4653 17.5625H13.5347C14.438 17.5625 14.8686 16.5339 14.2639 15.9375Z'
                    fill='currentColor'
                  />
                  <path
                    d='M5.25 6C5.25 4.75736 6.25736 3.75 7.5 3.75H16.5C17.7426 3.75 18.75 4.75736 18.75 6V18C18.75 19.2426 17.7426 20.25 16.5 20.25H7.5C6.25736 20.25 5.25 19.2426 5.25 18V6Z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  />
                </svg>
              </div>
              <h3>Drop your photos here</h3>
              <p>
                or <span className='upload-link'>click to browse</span>
              </p>
              <small>Supports: JPG, PNG, GIF, WebP (Multiple files supported)</small>
              {enableCompression && (
                <small className='compression-feature'>
                  🗜️ Auto-compression enabled for better performance
                </small>
              )}
            </>
          )}
        </div>
      </div>

      {/* Compression Progress Modal */}
      <CompressionProgress
        isVisible={isCompressing}
        progress={progress}
        current={current}
        total={total}
      />
    </>
  );
};
