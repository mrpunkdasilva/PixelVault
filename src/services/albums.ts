/**
 * Albums Service
 * Repository pattern implementation for album operations
 * Abstraction for self-hosted API
 */

import type {
  Album,
  AlbumId,
  CreateAlbumRequest,
  UpdateAlbumRequest,
  AlbumWithPhotos,
  PhotoId,
  PhotoMoveOperation,
} from '../types';
import { photoService } from './photos';

const BASE_URL = 'http://localhost:3001/api'; // Our self-hosted backend URL

// Interface do Repository (Dependency Inversion Principle)
export interface IAlbumRepository {
  getAll(): Promise<Album[]>;
  getById(id: AlbumId): Promise<Album | null>;
  getWithPhotos(id: AlbumId): Promise<AlbumWithPhotos | null>;
  create(request: CreateAlbumRequest): Promise<Album>;
  update(id: AlbumId, request: UpdateAlbumRequest): Promise<Album>;
  delete(id: AlbumId): Promise<void>;
  addPhotoToAlbum(albumId: AlbumId, photoId: PhotoId): Promise<void>;
  removePhotoFromAlbum(albumId: AlbumId, photoId: PhotoId): Promise<void>;
  movePhoto(operation: PhotoMoveOperation): Promise<void>;
}

// Concrete implementation of the Repository using HTTP fetch
class HttpAlbumRepository implements IAlbumRepository {
  private readonly ALBUMS_ENDPOINT = `${BASE_URL}/albums`;

  private parseAlbumDates(album: any): Album {
    return {
      ...album,
      createdAt: new Date(album.createdAt),
      updatedAt: new Date(album.updatedAt),
    };
  }

  async getAll(): Promise<Album[]> {
    try {
      const response = await fetch(this.ALBUMS_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.map(this.parseAlbumDates) as Album[];
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw new Error('Failed to fetch albums');
    }
  }

  async getById(id: AlbumId): Promise<Album | null> {
    try {
      const response = await fetch(`${this.ALBUMS_ENDPOINT}/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return this.parseAlbumDates(data) as Album;
    } catch (error) {
      console.error(`Error fetching album ${id}:`, error);
      throw new Error(`Failed to fetch album ${id}`);
    }
  }

  async getWithPhotos(id: AlbumId): Promise<AlbumWithPhotos | null> {
    try {
      const response = await fetch(`${this.ALBUMS_ENDPOINT}/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const album = this.parseAlbumDates(data);
      // Assuming the backend now returns photos directly within the album object
      // If not, this part needs to be adjusted based on the actual backend response
      return {
        ...album,
        photos: data.photos || [], // Assuming photos array is directly in the response
      } as AlbumWithPhotos;
    } catch (error) {
      console.error(`Error fetching album with photos ${id}:`, error);
      throw new Error(`Failed to fetch album with photos ${id}`);
    }
  }

  async create(request: CreateAlbumRequest): Promise<Album> {
    try {
      const response = await fetch(this.ALBUMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return this.parseAlbumDates(data) as Album;
    } catch (error) {
      console.error('Error creating album:', error);
      throw new Error('Failed to create album');
    }
  }

  async update(id: AlbumId, request: UpdateAlbumRequest): Promise<Album> {
    try {
      const response = await fetch(`${this.ALBUMS_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return this.parseAlbumDates(data) as Album;
    } catch (error) {
      console.error(`Error updating album ${id}:`, error);
      throw new Error(`Failed to update album ${id}`);
    }
  }

  async delete(id: AlbumId): Promise<void> {
    try {
      const response = await fetch(`${this.ALBUMS_ENDPOINT}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting album ${id}:`, error);
      throw new Error(`Failed to delete album ${id}`);
    }
  }

  async addPhotoToAlbum(albumId: AlbumId, photoId: PhotoId): Promise<void> {
    try {
      const response = await fetch(`${this.ALBUMS_ENDPOINT}/${albumId}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error adding photo ${photoId} to album ${albumId}:`, error);
      throw new Error(`Failed to add photo to album`);
    }
  }

  async removePhotoFromAlbum(albumId: AlbumId, photoId: PhotoId): Promise<void> {
    try {
      const response = await fetch(`${this.ALBUMS_ENDPOINT}/${albumId}/photos/${photoId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error removing photo ${photoId} from album ${albumId}:`, error);
      throw new Error(`Failed to remove photo from album`);
    }
  }

  async movePhoto(operation: PhotoMoveOperation): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/photos/${operation.photoId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fromAlbumId: operation.fromAlbumId, toAlbumId: operation.toAlbumId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error moving photo:', error);
      throw new Error('Failed to move photo between albums');
    }
  }
}

// Singleton instance (can be injected via DI in the future)
export const albumRepository: IAlbumRepository = new HttpAlbumRepository();

// Service facade for application use
export class AlbumService {
  constructor(private repository: IAlbumRepository = albumRepository) {}

  // Simple delegation to the repository
  async getAllAlbums(): Promise<Album[]> {
    return this.repository.getAll();
  }

  async getAlbum(id: AlbumId): Promise<Album | null> {
    return this.repository.getById(id);
  }

  async getAlbumWithPhotos(id: AlbumId): Promise<AlbumWithPhotos | null> {
    const album = await this.repository.getById(id);
    if (!album) {
      return null;
    }
    const photos = await photoService.getPhotosByAlbumId(id);
    return { ...album, photos };
  }

  

  async createAlbum(request: CreateAlbumRequest): Promise<Album> {
    // Business validation
    if (!request.name.trim()) {
      throw new Error('Album name is required');
    }

    if (request.name.length > 100) {
      throw new Error('Album name is too long');
    }

    return this.repository.create(request);
  }

  async updateAlbum(id: AlbumId, request: UpdateAlbumRequest): Promise<Album> {
    // Business validation
    if (request.name !== undefined && !request.name.trim()) {
      throw new Error('Album name cannot be empty');
    }

    if (request.name && request.name.length > 100) {
      throw new Error('Album name is too long');
    }

    return this.repository.update(id, request);
  }

  async deleteAlbum(id: AlbumId): Promise<void> {
    // Check if it's not a default album
    const album = await this.repository.getById(id);
    if (album?.isDefault) {
      throw new Error('Cannot delete default album');
    }

    return this.repository.delete(id);
  }

  async addPhotoToAlbum(albumId: AlbumId, photoId: PhotoId): Promise<void> {
    return this.repository.addPhotoToAlbum(albumId, photoId);
  }

  async removePhotoFromAlbum(albumId: AlbumId, photoId: PhotoId): Promise<void> {
    return this.repository.removePhotoFromAlbum(albumId, photoId);
  }

  async movePhotoBetweenAlbums(operation: PhotoMoveOperation): Promise<void> {
    return this.repository.movePhoto(operation);
  }
}

// Default instance for application use
export const albumService = new AlbumService();
