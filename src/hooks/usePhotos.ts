/**
 * usePhotos Hook
 * Hook para gerenciamento de fotos com álbuns
 * Placeholder para integração futura
 */

import { useState, useEffect } from 'react';
import type { Photo } from '../types/Photo';
import * as Photos from '../services/photos';

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load real photos from service
  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      try {
        const legacyPhotos = await Photos.getAll();
        // Convert legacy photos to new Photo type
        const convertedPhotos: Photo[] = legacyPhotos.map((photo, index) => ({
          id: index.toString(),
          url: photo.url,
          name: photo.name,
          size: 1024000, // Placeholder size
          mimeType: 'image/jpeg', // Placeholder type
          albumIds: [], // Not assigned to any album yet
          uploadedAt: new Date(),
          tags: []
        }));
        setPhotos(convertedPhotos);
      } catch (error) {
        setError('Failed to load photos');
        console.error('Error loading photos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const addPhotoToAlbum = async (photoId: string, albumId: string) => {
    // TODO: Implement with photo service
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, albumIds: [...photo.albumIds, albumId] }
        : photo
    ));
  };

  const removePhotoFromAlbum = async (photoId: string, albumId: string) => {
    // TODO: Implement with photo service
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId
        ? { ...photo, albumIds: photo.albumIds.filter(id => id !== albumId) }
        : photo
    ));
  };

  const deletePhoto = async (photoId: string) => {
    // TODO: Implement with photo service
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  return {
    photos,
    loading,
    error,
    addPhotoToAlbum,
    removePhotoFromAlbum,
    deletePhoto
  };
};