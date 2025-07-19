import { useState } from 'react';
import './styles.scss';
import { LazyImage } from '../LazyImage';

type Props = {
  url: string;
  name: string;
  onClick?: () => void;
  onDelete?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
};

export const PhotoItem = ({ url, name, onClick, onDelete, draggable, onDragStart, onDragEnd }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div
      className='photo-item-container'
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className='photo-image-wrapper'>
        <LazyImage src={url} alt={name} className='photo-image' />

        <div className={`photo-overlay ${isHovered ? 'visible' : ''}`}>
          <div className='photo-actions'>
            <button className='action-btn view-btn' onClick={onClick} aria-label='View image'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z'
                  fill='currentColor'
                />
              </svg>
            </button>
            {onDelete && (
              <button
                className='action-btn delete-btn'
                onClick={handleDelete}
                aria-label='Delete image'
              >
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M6 7H5V5H9L10 4H14L15 5H19V7H18V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V7ZM8 9V19H16V9H8ZM9 11H11V17H9V11ZM13 11H15V17H13V11Z'
                    fill='currentColor'
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className='photo-info'>
        <h4 className='photo-name' title={name}>
          {name}
        </h4>
      </div>
    </div>
  );
};
