/**
 * usePhotos Hook
 * Hook para gerenciamento de fotos com álbuns
 * Integração com serviços de álbuns e fotos
 */

import { useState, useEffect, useCallback } from 'react';
import type { Photo } from '../types/Photo';
import * as Photos from '../services/photos';
import { albumService } from '../services/albums';

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load photos with album associations
  const loadPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const legacyPhotos = await Photos.getAll();

      // Convert legacy photos to new Photo type
      const convertedPhotos: Photo[] = legacyPhotos.map(photo => ({
        id: photo.name, // Use Firebase storage name as consistent ID
        url: photo.url,
        name: photo.name,
        size: 1024000, // Placeholder size (could be enhanced to get real size)
        mimeType: 'image/jpeg', // Placeholder type (could be enhanced to detect type)
        albumIds: [], // Will be populated with album associations
        uploadedAt: new Date(),
        tags: [],
      }));

      setPhotos(convertedPhotos);
    } catch (error) {
      setError('Failed to load photos');
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load photos on mount
  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const addPhotoToAlbum = async (photoId: string, albumId: string) => {
    try {
      // Call album service to create association
      await albumService.addPhotoToAlbum(albumId, photoId);

      // Update local state
      setPhotos(prev =>
        prev.map(photo =>
          photo.id === photoId
            ? { ...photo, albumIds: [...new Set([...photo.albumIds, albumId])] }
            : photo,
        ),
      );
    } catch (error) {
      console.error('Error adding photo to album:', error);
      throw error; // Re-throw for component error handling
    }
  };

  const removePhotoFromAlbum = async (photoId: string, albumId: string) => {
    try {
      // Call album service to remove association
      await albumService.removePhotoFromAlbum(albumId, photoId);

      // Update local state
      setPhotos(prev =>
        prev.map(photo =>
          photo.id === photoId
            ? { ...photo, albumIds: photo.albumIds.filter(id => id !== albumId) }
            : photo,
        ),
      );
    } catch (error) {
      console.error('Error removing photo from album:', error);
      throw error; // Re-throw for component error handling
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      // TODO: Implement photo deletion in Firebase Storage
      // For now, just remove from local state
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  };

  // Add a photo to local state (used after upload)
  const addPhoto = useCallback((photo: Photo) => {
    setPhotos(prev => {
      // Check if photo already exists
      const exists = prev.some(p => p.id === photo.id);
      if (exists) {
        // Update existing photo
        return prev.map(p => (p.id === photo.id ? photo : p));
      } else {
        // Add new photo
        return [...prev, photo];
      }
    });
  }, []);

  // Refresh photos from server
  const refreshPhotos = useCallback(() => {
    return loadPhotos();
  }, [loadPhotos]);

  return {
    photos,
    loading,
    error,
    addPhotoToAlbum,
    removePhotoFromAlbum,
    deletePhoto,
    addPhoto,
    refreshPhotos,
  };
};
