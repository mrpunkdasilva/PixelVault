/**
 * usePhotos Hook
 * Hook for managing photos with albums
 * Integration with album and photo services
 */

import { useState, useEffect, useCallback } from 'react';
import type { Photo, PhotoId } from '../types/Photo';
import { photoService } from '../services/photos';
import { albumService } from '../services/albums';
import { useAlbum } from '../contexts/AlbumContext'; // Import useAlbum

export const usePhotos = (albumId?: string) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let fetchedPhotos: Photo[] = [];
      if (albumId) {
        fetchedPhotos = await photoService.getPhotosByAlbumId(albumId);
      }
      setPhotos(fetchedPhotos);
    } catch (error) {
      setError('Failed to load photos');
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos, albumId]);

  const addPhotoToAlbum = async (photoId: string, albumId: string) => {
    try {
      await albumService.addPhotoToAlbum(albumId, photoId);
      // After adding, refetch photos to ensure state is consistent with backend
      await loadPhotos();
    } catch (error) {
      console.error('Error adding photo to album:', error);
      throw error;
    }
  };

  const removePhotoFromAlbum = async (photoId: string, albumId: string) => {
    try {
      await albumService.removePhotoFromAlbum(albumId, photoId);
      // After removing, refetch photos to ensure state is consistent with backend
      await loadPhotos();
    } catch (error) {
      console.error('Error removing photo from album:', error);
      throw error;
    }
  };

  const deletePhoto = async (photoId: PhotoId) => {
    try {
      // The backend will handle deleting the file and its associations
      await photoService.deletePhoto(photoId);
      // After deleting, refetch photos to ensure state is consistent with backend
      await loadPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  };

  const addPhoto = useCallback(async (file: File, albumId: string) => {
    try {
      const newPhoto = await photoService.uploadPhoto(file, albumId);
      // After successful upload and creation, refetch photos to update the list
      await loadPhotos();
      return newPhoto;
    } catch (error) {
      console.error('Error adding photo:', error);
      throw error;
    }
  }, [loadPhotos]);

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
