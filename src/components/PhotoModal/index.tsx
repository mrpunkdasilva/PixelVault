import { useEffect, useState, useRef, useCallback } from 'react';
import './styles.scss';

type Props = {
  isOpen: boolean;
  imageUrl: string;
  imageName: string;
  onClose: () => void;
  onDelete?: () => void;
};

export const PhotoModal = ({ isOpen, imageUrl, imageName, onClose, onDelete }: Props) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const minZoom = 0.5;
  const maxZoom = 5;
  const zoomStep = 0.25;

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - zoomStep, minZoom));
  }, []);

  const fitToScreen = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const img = imageRef.current;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const scaleX = containerWidth / imgWidth;
    const scaleY = containerHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    setZoom(scale);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          fitToScreen();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      resetZoom();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, zoomIn, zoomOut, resetZoom, fitToScreen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageName;
    link.click();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className='photo-modal-overlay' onClick={handleBackdropClick}>
      <div className='photo-modal'>
        <div className='photo-modal-header'>
          <h3 className='photo-modal-title'>{imageName}</h3>
          <div className='zoom-info'>
            <span className='zoom-level'>{Math.round(zoom * 100)}%</span>
          </div>
          <div className='photo-modal-actions'>
            <button
              className='action-btn download-btn'
              onClick={handleDownload}
              aria-label='Download image'
              title='Download (D)'
            >
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M12 16L7 11L8.41 9.59L11 12.17V4H13V12.17L15.59 9.59L17 11L12 16Z'
                  fill='currentColor'
                />
                <path d='M19 18H5V20H19V18Z' fill='currentColor' />
              </svg>
            </button>
            {onDelete && (
              <button
                className='action-btn delete-btn'
                onClick={onDelete}
                aria-label='Delete image'
                title='Delete'
              >
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M6 7H5V5H9L10 4H14L15 5H19V7H18V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V7ZM8 9V19H16V9H8ZM9 11H11V17H9V11ZM13 11H15V17H13V11Z'
                    fill='currentColor'
                  />
                </svg>
              </button>
            )}
            <button
              className='action-btn close-btn'
              onClick={onClose}
              aria-label='Close modal'
              title='Close (ESC)'
            >
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z'
                  fill='currentColor'
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          className='photo-modal-content'
          ref={containerRef}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt={imageName}
            className={`photo-modal-image ${isDragging ? 'dragging' : ''}`}
            style={{
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
            onMouseDown={handleMouseDown}
            onLoad={fitToScreen}
            draggable={false}
          />
        </div>

        <div className='photo-modal-controls'>
          <div className='zoom-controls'>
            <button
              className='control-btn zoom-out-btn'
              onClick={zoomOut}
              disabled={zoom <= minZoom}
              title='Zoom Out (-)'
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                <path d='M19 13H5V11H19V13Z' fill='currentColor' />
              </svg>
            </button>

            <button className='control-btn fit-btn' onClick={fitToScreen} title='Fit to Screen (F)'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                <path d='M9 9H15V15H9V9ZM11 11V13H13V11H11Z' fill='currentColor' />
                <path
                  d='M21 3H3C2.45 3 2 3.45 2 4V20C2 20.55 2.45 21 3 21H21C21.55 21 22 20.55 22 20V4C22 3.45 21.55 3 21 3ZM20 19H4V5H20V19Z'
                  fill='currentColor'
                />
              </svg>
            </button>

            <button className='control-btn reset-btn' onClick={resetZoom} title='Reset Zoom (0)'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C14.24 4.42 12.06 4.64 10.27 5.86L11.69 7.28C13.07 6.5 14.83 6.57 16.17 7.5L13.5 10.17L15 11.67L21 9ZM4.83 5.17L13.5 13.83L15 12.33L6.33 3.67L4.83 5.17Z'
                  fill='currentColor'
                />
              </svg>
            </button>

            <button
              className='control-btn zoom-in-btn'
              onClick={zoomIn}
              disabled={zoom >= maxZoom}
              title='Zoom In (+)'
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                <path d='M19 11H13V5H11V11H5V13H11V19H13V13H19V11Z' fill='currentColor' />
              </svg>
            </button>
          </div>

          <div className='help-text'>
            <span>Scroll to zoom • Drag to pan • F: fit • 0: reset • +/-: zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export types for TypeScript
export type PhotoModalProps = Props;

// Default export for lazy loading
export default PhotoModal;
