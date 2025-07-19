/**
 * usePhotos Hook
 * Hook para gerenciamento de fotos com álbuns
 * Integração com serviços de álbuns e fotos
 */

import { useState, useEffect, useCallback } from 'react';
import type { Photo, PhotoId, AlbumId } from '../types/Photo';
import * as Photos from '../services/photos';
import { albumService } from '../services/albums';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../libs/firebase';

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch all photos from Firebase Storage (now returns Photo[] with basic metadata)
      const storagePhotos = await Photos.getAll();

      // 2. Fetch all album-photo associations from Firestore
      const albumPhotosCollectionRef = collection(db, 'album-photos');
      const albumPhotosSnapshot = await getDocs(albumPhotosCollectionRef);

      const photoAlbumMap = new Map<PhotoId, AlbumId[]>();
      albumPhotosSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const photoId: PhotoId = data.photoId;
        const albumId: AlbumId = data.albumId;

        if (!photoAlbumMap.has(photoId)) {
          photoAlbumMap.set(photoId, []);
        }
        photoAlbumMap.get(photoId)?.push(albumId);
      });

      // 3. Enrich storagePhotos with album associations
      const enrichedPhotos: Photo[] = storagePhotos.map(storagePhoto => {
        const albumIds = photoAlbumMap.get(storagePhoto.id) || [];
        return {
          ...storagePhoto,
          albumIds: albumIds,
        };
      });

      setPhotos(enrichedPhotos);
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
      await albumService.addPhotoToAlbum(albumId, photoId);

      setPhotos(prev =>
        prev.map(photo =>
          photo.id === photoId
            ? { ...photo, albumIds: [...new Set([...photo.albumIds, albumId])] }
            : photo,
        ),
      );
    } catch (error) {
      console.error('Error adding photo to album:', error);
      throw error;
    }
  };

  const removePhotoFromAlbum = async (photoId: string, albumId: string) => {
    try {
      await albumService.removePhotoFromAlbum(albumId, photoId);

      setPhotos(prev =>
        prev.map(photo =>
          photo.id === photoId
            ? { ...photo, albumIds: photo.albumIds.filter(id => id !== albumId) }
            : photo,
        ),
      );
    } catch (error) {
      console.error('Error removing photo from album:', error);
      throw error;
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      // 1. Delete photo from Firebase Storage
      await Photos.deletePhoto(photoId);

      // 2. Remove all associations from Firestore's album-photos collection
      await albumService.removeAllPhotoAssociations(photoId);

      // 3. Remove from local state
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  };

  const addPhoto = useCallback((photo: Photo) => {
    setPhotos(prev => {
      const exists = prev.some(p => p.id === photo.id);
      if (exists) {
        return prev.map(p => (p.id === photo.id ? photo : p));
      } else {
        return [...prev, photo];
      }
    });
  }, []);

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
