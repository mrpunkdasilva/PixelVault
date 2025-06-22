/**
 * AlbumCard Component
 * Card individual para exibição de álbum
 * Implementa drag & drop e interações de usuário
 */

import React, { useCallback, useState } from 'react';
import { useAlbumDropZone } from '../../hooks/useAlbumDragDrop';
import { useAlbum } from '../../contexts/AlbumContext';
import { useNotificationHelpers } from '../../contexts/NotificationContext';
import type { Album } from '../../types';
import './styles.scss';

interface AlbumCardProps {
  album: Album;
  onClick?: (albumId: string) => void;
  onEdit?: (album: Album) => void;
  onDelete?: (albumId: string) => void;
  className?: string;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  onClick,
  onEdit,
  onDelete,
  className = '',
}) => {
  const { deleteAlbum } = useAlbum();
  const { showSuccess, showError } = useNotificationHelpers();
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drag & Drop
  const dropZone = useAlbumDropZone(album.id);

  // Event handlers
  const handleClick = useCallback(() => {
    if (!dropZone.isDragging) {
      onClick?.(album.id);
    }
  }, [onClick, album.id, dropZone.isDragging]);

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit?.(album);
    },
    [onEdit, album],
  );

  const handleDelete = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (album.isDefault) {
        showError('Cannot Delete', 'Cannot delete default album');
        return;
      }

      if (!window.confirm(`Are you sure you want to delete "${album.name}"?`)) {
        return;
      }

      try {
        setIsDeleting(true);
        await deleteAlbum(album.id);
        onDelete?.(album.id);
      } catch (error) {
        console.error('Error deleting album:', error);
      } finally {
        setIsDeleting(false);
      }
    },
    [album, deleteAlbum, onDelete, showError],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      const result = await dropZone.onDrop(e);
      if (result.success) {
        showSuccess('Photo Moved', 'Photo moved successfully');
      }
    },
    [dropZone, showSuccess],
  );

  // CSS classes
  const cardClasses = [
    'album-card',
    className,
    dropZone.isDropTarget && 'album-card--drop-target',
    dropZone.isDragging && 'album-card--drag-active',
    isDeleting && 'album-card--deleting',
  ]
    .filter(Boolean)
    .join(' ');

  // Render cover image
  const renderCoverImage = () => {
    if (album.coverPhotoId) {
      return (
        <div className='album-card__cover'>
          <img
            src={`/api/photos/${album.coverPhotoId}/thumbnail`}
            alt={`${album.name} cover`}
            loading='lazy'
            onError={e => {
              // Fallback para placeholder
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-album.svg';
            }}
          />
        </div>
      );
    }

    return (
      <div className='album-card__cover album-card__cover--placeholder'>
        <svg viewBox='0 0 24 24' fill='currentColor'>
          <path d='M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      </div>
    );
  };

  // Render tags
  const renderTags = () => {
    if (album.tags.length === 0) return null;

    const visibleTags = album.tags.slice(0, 3);
    const remainingCount = album.tags.length - 3;

    return (
      <div className='album-card__tags'>
        {visibleTags.map(tag => (
          <span key={tag} className='album-card__tag'>
            {tag}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className='album-card__tag album-card__tag--more'>+{remainingCount}</span>
        )}
      </div>
    );
  };

  return (
    <div
      className={cardClasses}
      data-album-id={album.id}
      onClick={handleClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onDragOver={dropZone.onDragOver}
      onDragEnter={dropZone.onDragEnter}
      onDragLeave={dropZone.onDragLeave}
      onDrop={handleDrop}
      role='button'
      tabIndex={0}
      aria-label={`Open album ${album.name}`}
    >
      {/* Cover Image */}
      {renderCoverImage()}

      {/* Drop Zone Overlay */}
      {dropZone.isDropTarget && (
        <div className='album-card__drop-overlay'>
          <div className='album-card__drop-message'>Drop photo here</div>
        </div>
      )}

      {/* Content */}
      <div className='album-card__content'>
        <div className='album-card__header'>
          <h3 className='album-card__title'>{album.name}</h3>
          <span className='album-card__count'>
            {album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}
          </span>
        </div>

        {album.description && <p className='album-card__description'>{album.description}</p>}

        {renderTags()}

        <div className='album-card__meta'>
          <time className='album-card__date'>{album.updatedAt.toLocaleDateString()}</time>
        </div>
      </div>

      {/* Actions */}
      {showActions && !album.isDefault && (
        <div className='album-card__actions'>
          <button
            className='album-card__action'
            onClick={handleEdit}
            aria-label={`Edit album ${album.name}`}
            disabled={isDeleting}
          >
            <svg viewBox='0 0 24 24' fill='currentColor'>
              <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
            </svg>
          </button>

          <button
            className='album-card__action album-card__action--danger'
            onClick={handleDelete}
            aria-label={`Delete album ${album.name}`}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <svg viewBox='0 0 24 24' fill='currentColor' className='spin'>
                <path d='M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z' />
              </svg>
            ) : (
              <svg viewBox='0 0 24 24' fill='currentColor'>
                <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Default Album Badge */}
      {album.isDefault && <div className='album-card__badge'>Default</div>}
    </div>
  );
};
