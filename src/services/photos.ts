/**
 * Photos Service
 * Repository pattern implementation for photo operations
 * Abstraction for self-hosted API
 */

import type { Photo, PhotoId, PhotoCreateEntryRequest } from '../types/Photo';

const BASE_URL = 'http://localhost:3001/api'; // Our self-hosted backend URL

// Interface do Repository (Dependency Inversion Principle)
export interface IPhotoRepository {
  // getAll(): Promise<Photo[]>; // Removed
  getById(id: PhotoId): Promise<Photo | null>;
  getPhotosByAlbumId(albumId: string): Promise<Photo[]>;
  uploadPhoto(file: File, albumId: string): Promise<Photo>;
  deletePhoto(id: PhotoId): Promise<void>;
}

// Concrete implementation of the Repository using HTTP fetch
class HttpPhotoRepository implements IPhotoRepository {
  private readonly PHOTOS_ENDPOINT = `${BASE_URL}/photos`;
  private readonly UPLOAD_ENDPOINT = `${BASE_URL}/photos/upload`;

  private parsePhotoDates(photo: any): Photo {
    return {
      ...photo,
      uploadedAt: new Date(photo.uploadedAt),
    };
  }

  // Removed getAll as there is no direct endpoint for all photos
  // async getAll(): Promise<Photo[]> {
  //   try {
  //     const response = await fetch(this.PHOTOS_ENDPOINT);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     return data.map(this.parsePhotoDates) as Photo[];
  //   } catch (error) {
  //     console.error('Error fetching all photos:', error);
  //     throw new Error('Failed to fetch all photos');
  //   }
  // }

  async getById(id: PhotoId): Promise<Photo | null> {
    try {
      const response = await fetch(`${this.PHOTOS_ENDPOINT}/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return this.parsePhotoDates(data) as Photo;
    } catch (error) {
      console.error(`Error fetching photo ${id}:`, error);
      throw new Error(`Failed to fetch photo ${id}`);
    }
  }

  async getPhotosByAlbumId(albumId: string): Promise<Photo[]> {
    try {
      const response = await fetch(`${BASE_URL}/albums/${albumId}/photos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.map(this.parsePhotoDates) as Photo[];
    } catch (error) {
      console.error(`Error fetching photos for album ${albumId}:`, error);
      throw new Error(`Failed to fetch photos for album ${albumId}`);
    }
  }

  async uploadPhoto(file: File, albumId: string): Promise<Photo> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const uploadResponse = await fetch(this.UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`HTTP error during upload! status: ${uploadResponse.status}`);
      }
      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.imageUrl; // URL from the backend

      // Now, create the photo entry in the database via the backend
      const createPhotoRequest: PhotoCreateEntryRequest = {
        name: file.name, // Original file name
        url: imageUrl,
        albumId: albumId,
        size: file.size,
        mimeType: file.type,
        tags: [], // Assuming tags are added later or via another mechanism
      };

      const photoEntryResponse = await fetch(`${BASE_URL}/albums/${albumId}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPhotoRequest),
      });

      if (!photoEntryResponse.ok) {
        // If photo entry creation fails, consider deleting the uploaded file from the server
        console.error('Failed to create photo entry after successful upload. Consider cleanup.');
        throw new Error(`HTTP error creating photo entry! status: ${photoEntryResponse.status}`);
      }

      const photoData = await photoEntryResponse.json();
      return this.parsePhotoDates(photoData) as Photo;

    } catch (error) {
      console.error('Error uploading photo:', error);
      throw new Error('Failed to upload photo');
    }
  }

  async deletePhoto(id: PhotoId): Promise<void> {
    try {
      const response = await fetch(`${this.PHOTOS_ENDPOINT}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting photo ${id}:`, error);
      throw new Error(`Failed to delete photo ${id}`);
    }
  }
}

// Singleton instance (can be injected via DI in the future)
export const photoRepository: IPhotoRepository = new HttpPhotoRepository();

// Service facade for application use
export class PhotoService {
  constructor(private repository: IPhotoRepository = photoRepository) {}

  // Simple delegation to the repository
  // async getAllPhotos(): Promise<Photo[]> { // Removed
  //   return this.repository.getAll();
  // }

  async getPhoto(id: PhotoId): Promise<Photo | null> {
    return this.repository.getById(id);
  }

  async getPhotosByAlbumId(albumId: string): Promise<Photo[]> {
    return this.repository.getPhotosByAlbumId(albumId);
  }

  async uploadPhoto(file: File, albumId: string): Promise<Photo> {
    // Business validation
    const SUPPORTED_FILES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!SUPPORTED_FILES.includes(file.type)) {
      throw new Error('Unsupported file type.');
    }

    if (file.size > 5 * 1024 * 1024) { // Example: 5MB limit
      throw new Error('File size exceeds limit (5MB).');
    }

    return this.repository.uploadPhoto(file, albumId);
  }

  async deletePhoto(id: PhotoId): Promise<void> {
    return this.repository.deletePhoto(id);
  }
}

// Default instance for application use
export const photoService = new PhotoService();