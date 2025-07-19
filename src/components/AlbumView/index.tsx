/**
 * AlbumView Component
 * Visualização individual de álbuns com gerenciamento de fotos
 * Implementa drag & drop, grid responsivo e ações em lote
 */

import React, { useCallback, useState, useEffect } from 'react';
import { useAlbum } from '../../contexts/AlbumContext';
import { usePhotos } from '../../hooks/usePhotos';
import { PhotoItem } from '../PhotoItem';
import { EmptyState } from '../EmptyState';
import { LoadingSkeletons } from '../LoadingSkeletons';
import { AlbumForm } from '../AlbumForm';
import { UploadZone } from '../UploadZone';
import { useNotificationHelpers } from '../../contexts/NotificationContext';
import type { Photo } from '../../types/Photo';
import type { AlbumWithPhotos } from '../../types';
import * as Photos from '../../services/photos';
import './styles.scss';

interface AlbumViewProps {
  albumId: string;
  onBackToAlbums: () => void;
}

export const AlbumView: React.FC<AlbumViewProps> = ({
  albumId,
  onBackToAlbums,
}) => {
  // States
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isEditingAlbum, setIsEditingAlbum] = useState(false);
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Hooks
  const {
    albums,
    currentAlbum,
    ui: { isLoading },
    loadAlbum,
    deleteAlbum,
  } = useAlbum();
  const {
    photos,
    loading: photosLoading,
    addPhotoToAlbum,
    removePhotoFromAlbum,
    addPhoto,
    refreshPhotos,
    deletePhoto,
  } = usePhotos();
  const { showSuccess, showError } = useNotificationHelpers();

  // Get current album (will be loaded by context)
  const album: AlbumWithPhotos | null = currentAlbum || albums.find(album => album.id === albumId) as AlbumWithPhotos;
  const albumPhotos = album?.photos
    ? album.photos.filter(p => photos.some(fp => fp.id === p.id))
    : photos.filter(photo => photo.albumIds.includes(albumId));

  // Loading state
  const loading = isLoading || photosLoading;

  // Handlers
  const handleEditAlbum = useCallback(() => {
    setIsEditingAlbum(true);
  }, []);

  const handleDeleteAlbum = useCallback(async () => {
    if (!album) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the album "${album.name}"? This will remove ${albumPhotos.length} photos from the album.`,
    );

    if (confirmDelete) {
      try {
        await deleteAlbum(albumId);
        onBackToAlbums();
      } catch (error) {
        // Error handling is done in the context
        console.error('Delete album error:', error);
      }
    }
  }, [album, albumPhotos.length, deleteAlbum, albumId, onBackToAlbums]);

  const handleSelectPhoto = useCallback((photoId: string) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allPhotoIds = albumPhotos.map(photo => photo.id);
    setSelectedPhotos(new Set(allPhotoIds));
  }, [albumPhotos]);

  const handleDeselectAll = useCallback(() => {
    setSelectedPhotos(new Set());
  }, []);

  const handleToggleSelectionMode = useCallback(() => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedPhotos(new Set());
    }
  }, [isSelectionMode]);

  const handleRemoveSelectedFromAlbum = useCallback(async () => {
    if (selectedPhotos.size === 0) return;

    const confirmRemove = window.confirm(
      `Remove ${selectedPhotos.size} photo${selectedPhotos.size > 1 ? 's' : ''} from this album?`,
    );

    if (confirmRemove) {
      try {
        for (const photoId of selectedPhotos) {
          await removePhotoFromAlbum(photoId, albumId);
        }
        showSuccess('Photos Removed', `${selectedPhotos.size} photos removed from album.`);
        setSelectedPhotos(new Set());
        setIsSelectionMode(false);
      } catch (error) {
        showError('Remove Failed', 'Failed to remove photos from album.');
      }
    }
  }, [selectedPhotos, removePhotoFromAlbum, albumId, showSuccess, showError]);

  
  // Photo upload handlers
  const handleFileSelect = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const result = await Photos.insert(file);
        if (result instanceof Error) {
          showError('Upload Failed', result.message);
        } else {
          // Convert legacy photo to new photo format
          const newPhoto: Photo = {
            id: result.name, // Use Firebase storage name as ID
            name: result.name,
            url: result.url,
            size: file.size,
            mimeType: file.type,
            albumIds: [albumId],
            uploadedAt: new Date(),
            tags: [],
          };

          // Add photo to local state first
          addPhoto(newPhoto);

          // Add photo to album using album service
          try {
            await addPhotoToAlbum(newPhoto.id, albumId);
            showSuccess('Photo Uploaded', 'Photo has been added to the album!');
            // Refresh photos to ensure consistency
            await refreshPhotos();
          } catch (albumError) {
            console.error('Failed to add photo to album:', albumError);
            showError('Album Association Failed', 'Photo uploaded but failed to add to album.');
          }
        }
      } catch (error) {
        console.error('Upload error:', error);
        showError('Upload Failed', 'Failed to upload photo to album.');
      } finally {
        setUploading(false);
      }
    },
    [albumId, addPhotoToAlbum, addPhoto, refreshPhotos, showSuccess, showError],
  );

  const handleMultipleFilesSelect = useCallback(
    async (files: File[]) => {
      setUploading(true);
      let successCount = 0;
      let errorCount = 0;

      for (const file of files) {
        try {
          const result = await Photos.insert(file);
          if (result instanceof Error) {
            errorCount++;
          } else {
            // Convert legacy photo to new photo format
            const newPhoto: Photo = {
              id: result.name, // Use Firebase storage name as ID
              name: result.name,
              url: result.url,
              size: file.size,
              mimeType: file.type,
              albumIds: [albumId],
              uploadedAt: new Date(),
              tags: [],
            };

            // Add photo to local state first
            addPhoto(newPhoto);

            // Add photo to album using album service
            try {
              await addPhotoToAlbum(newPhoto.id, albumId);
              successCount++;
            } catch (albumError) {
              console.error('Failed to add photo to album:', albumError);
              errorCount++;
            }
          }
        } catch (error) {
          console.error('Upload error:', error);
          errorCount++;
        }
      }

      setUploading(false);

      // Refresh photos to ensure consistency if any uploads succeeded
      if (successCount > 0) {
        try {
          await refreshPhotos();
        } catch (error) {
          console.error('Failed to refresh photos after upload:', error);
        }
      }

      // Show appropriate notification
      if (successCount > 0 && errorCount === 0) {
        showSuccess(
          'Photos Uploaded',
          `${successCount} photo${successCount > 1 ? 's' : ''} added to album successfully!`,
        );
      } else if (successCount > 0 && errorCount > 0) {
        showError('Partial Upload', `${successCount} photos uploaded, ${errorCount} failed`);
      } else {
        showError('Upload Failed', 'All uploads failed');
      }
    },
    [albumId, addPhotoToAlbum, showSuccess, showError],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        if (isSelectionMode) {
          handleSelectAll();
        }
      } else if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        // Trigger file upload
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = event => {
          const files = Array.from((event.target as HTMLInputElement).files || []);
          if (files.length === 1) {
            handleFileSelect(files[0]);
          } else if (files.length > 1) {
            handleMultipleFilesSelect(files);
          }
        };
        input.click();
      } else if (e.key === 'Escape') {
        if (isSelectionMode) {
          handleToggleSelectionMode();
        } else if (isEditingAlbum) {
          setIsEditingAlbum(false);
        }
      } else if (e.key === 'Delete' && selectedPhotos.size > 0) {
        handleRemoveSelectedFromAlbum();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    isSelectionMode,
    selectedPhotos.size,
    handleSelectAll,
    handleToggleSelectionMode,
    handleRemoveSelectedFromAlbum,
    isEditingAlbum,
    handleFileSelect,
    handleMultipleFilesSelect,
  ]);

  // Load album data when component mounts
  useEffect(() => {
    if (albumId && !currentAlbum) {
      loadAlbum(albumId);
    }
  }, [albumId, currentAlbum, loadAlbum]);

  // Loading state
  if (loading) {
    return (
      <div className='album-view'>
        <LoadingSkeletons type='photos' count={8} />
      </div>
    );
  }

  // Album not found
  if (!album) {
    return (
      <div className='album-view'>
        <EmptyState
          type='generic'
          title='Album Not Found'
          description='The requested album could not be found.'
          actionLabel='Back to Albums'
          onAction={onBackToAlbums}
        />
      </div>
    );
  }

  return (
    <div className='album-view'>
      {/* Header */}
      <div className='album-view__header'>
        <div className='album-view__breadcrumb'>
          <button
            className='album-view__back-button'
            onClick={onBackToAlbums}
            aria-label='Back to albums'
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' />
            </svg>
          </button>
          <span className='album-view__breadcrumb-separator'>/</span>
          <span className='album-view__breadcrumb-text'>Albums</span>
          <span className='album-view__breadcrumb-separator'>/</span>
          <span className='album-view__breadcrumb-current'>{album.name}</span>
        </div>

        <div className='album-view__actions'>
          {isSelectionMode && (
            <div className='album-view__selection-actions'>
              <span className='album-view__selection-count'>{selectedPhotos.size} selected</span>
              <button
                className='album-view__action-button album-view__action-button--secondary'
                onClick={handleSelectAll}
                disabled={selectedPhotos.size === albumPhotos.length}
              >
                Select All
              </button>
              <button
                className='album-view__action-button album-view__action-button--secondary'
                onClick={handleDeselectAll}
                disabled={selectedPhotos.size === 0}
              >
                Deselect All
              </button>
              <button
                className='album-view__action-button album-view__action-button--danger'
                onClick={handleRemoveSelectedFromAlbum}
                disabled={selectedPhotos.size === 0}
              >
                Remove from Album
              </button>
            </div>
          )}

          <button
            className={`album-view__action-button ${isSelectionMode ? 'album-view__action-button--active' : ''}`}
            onClick={handleToggleSelectionMode}
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z' />
            </svg>
            {isSelectionMode ? 'Cancel' : 'Select'}
          </button>

          <button className='album-view__action-button' onClick={handleEditAlbum}>
            <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z' />
            </svg>
            Edit Album
          </button>

          <button
            className='album-view__action-button album-view__action-button--danger'
            onClick={handleDeleteAlbum}
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-2.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z' />
            </svg>
            Delete Album
          </button>
        </div>
      </div>

      {/* Album Info */}
      <div className='album-view__info'>
        <div className='album-view__title'>
          <h1>{album.name}</h1>
          <span className='album-view__photo-count'>
            {albumPhotos.length} photo{albumPhotos.length !== 1 ? 's' : ''}
          </span>
        </div>

        {album.description && <p className='album-view__description'>{album.description}</p>}

        {album.tags && album.tags.length > 0 && (
          <div className='album-view__tags'>
            {album.tags.map(tag => (
              <span key={tag} className='album-view__tag'>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Upload Zone */}
      <div className='album-view__upload-section'>
        <div className='album-view__upload-header'>
          <h3>Add Photos to Album</h3>
          <p>Upload photos directly to "{album.name}"</p>
        </div>
        <UploadZone
          onFileSelect={handleFileSelect}
          onMultipleFilesSelect={handleMultipleFilesSelect}
          uploading={uploading}
          enableCompression={true}
        />
      </div>

      {/* Photos Grid */}
      {albumPhotos.length > 0 ? (
        <div className='album-view__photos'>
          {albumPhotos.map(photo => (
            <div
              key={photo.id}
              className={`album-view__photo-wrapper ${
                selectedPhotos.has(photo.id) ? 'album-view__photo-wrapper--selected' : ''
              }`}
            >
              {isSelectionMode && (
                <div className='album-view__photo-checkbox'>
                  <input
                    type='checkbox'
                    checked={selectedPhotos.has(photo.id)}
                    onChange={() => handleSelectPhoto(photo.id)}
                  />
                </div>
              )}
              <PhotoItem
                url={photo.url}
                name={photo.name}
                onClick={() => !isSelectionMode && console.log('Open photo:', photo.id)}
                onDelete={() => deletePhoto(photo.id)}
                draggable={!isSelectionMode}
                
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          type='photos'
          title='No Photos in Album'
          description="This album doesn't contain any photos yet. Add some photos to get started!"
          actionLabel='Back to Albums'
          onAction={onBackToAlbums}
        />
      )}

      {/* Album Form Modal */}
      {isEditingAlbum && (
        <div className='modal-overlay' onClick={() => setIsEditingAlbum(false)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <AlbumForm
              mode='edit'
              album={album}
              onSuccess={() => {
                setIsEditingAlbum(false);
              }}
              onCancel={() => setIsEditingAlbum(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
