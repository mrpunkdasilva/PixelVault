import './CompressionProgress.scss';

interface CompressionProgressProps {
  isVisible: boolean;
  progress: number;
  current: number;
  total: number;
  onCancel?: () => void;
}

export const CompressionProgress = ({
  isVisible,
  progress,
  current,
  total,
  onCancel,
}: CompressionProgressProps) => {
  if (!isVisible) return null;

  return (
    <div className='compression-progress-overlay'>
      <div className='compression-progress-modal'>
        <div className='compression-progress-header'>
          <h3>Compressing Images</h3>
          <div className='compression-progress-stats'>
            {current} of {total} images processed
          </div>
        </div>

        <div className='compression-progress-bar-container'>
          <div className='compression-progress-bar' style={{ width: `${progress}%` }}>
            <div className='compression-progress-shimmer'></div>
          </div>
          <div className='compression-progress-text'>{Math.round(progress)}%</div>
        </div>

        <div className='compression-progress-details'>
          <div className='compression-detail-item'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
              <path
                d='M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z'
                fill='currentColor'
              />
            </svg>
            <span>Optimizing image quality and size</span>
          </div>
          <div className='compression-detail-item'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
              <path d='M12 2L2 7L12 12L22 7L12 2Z' fill='currentColor' />
              <path d='M2 17L12 22L22 17' fill='currentColor' />
              <path d='M2 12L12 17L22 12' fill='currentColor' />
            </svg>
            <span>Reducing file size for faster loading</span>
          </div>
        </div>

        {onCancel && (
          <div className='compression-progress-actions'>
            <button
              className='compression-cancel-btn'
              onClick={onCancel}
              disabled={progress > 90} // Disable cancel when almost done
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
