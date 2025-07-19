/**
 * Albums Service
 * Repository pattern implementation para operações de álbuns
 * Segue princípios SOLID e abstrai a implementação do Firebase
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../libs/firebase';
import type {
  Album,
  AlbumId,
  CreateAlbumRequest,
  UpdateAlbumRequest,
  AlbumWithPhotos,
  PhotoId,
  PhotoMoveOperation,
} from '../types';
import * as Photos from './photos';

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
  removeAllPhotoAssociations(photoId: PhotoId): Promise<void>;
  movePhoto(operation: PhotoMoveOperation): Promise<void>;
}

// Implementação concreta do Repository
class FirebaseAlbumRepository implements IAlbumRepository {
  private readonly COLLECTION_NAME = 'albums';
  private readonly ALBUM_PHOTOS_COLLECTION = 'album-photos';

  async getAll(): Promise<Album[]> {
    try {
      const albumsRef = collection(db, this.COLLECTION_NAME);
      const q = query(albumsRef, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => this.mapDocToAlbum(doc));
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw new Error('Failed to fetch albums');
    }
  }

  async getById(id: AlbumId): Promise<Album | null> {
    try {
      const albumRef = doc(db, this.COLLECTION_NAME, id);
      const albumSnap = await getDoc(albumRef);

      if (!albumSnap.exists()) {
        return null;
      }

      return this.mapDocToAlbum(albumSnap);
    } catch (error) {
      console.error(`Error fetching album ${id}:`, error);
      throw new Error(`Failed to fetch album ${id}`);
    }
  }

  async getWithPhotos(id: AlbumId): Promise<AlbumWithPhotos | null> {
    try {
      const album = await this.getById(id);
      if (!album) return null;

      // Buscar fotos do álbum
      const photosRef = collection(db, this.ALBUM_PHOTOS_COLLECTION);
      const q = query(photosRef, orderBy('addedAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const photoIds: PhotoId[] = querySnapshot.docs
        .filter(doc => doc.data().albumId === id)
        .map(doc => doc.data().photoId);

      // Fetch all photos and filter by the photoIds associated with this album
      const allPhotos = await Photos.getAll();
      const albumPhotos = allPhotos.filter(photo => photoIds.includes(photo.id));

      return {
        ...album,
        photos: albumPhotos,
      };
    } catch (error) {
      console.error(`Error fetching album with photos ${id}:`, error);
      throw new Error(`Failed to fetch album with photos ${id}`);
    }
  }

  async create(request: CreateAlbumRequest): Promise<Album> {
    try {
      const now = new Date();
      const albumData = {
        ...request,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        photoCount: 0,
        tags: request.tags || [],
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), albumData);

      return {
        id: docRef.id,
        ...request,
        createdAt: now,
        updatedAt: now,
        photoCount: 0,
        tags: request.tags || [],
      };
    } catch (error) {
      console.error('Error creating album:', error);
      throw new Error('Failed to create album');
    }
  }

  async update(id: AlbumId, request: UpdateAlbumRequest): Promise<Album> {
    try {
      const albumRef = doc(db, this.COLLECTION_NAME, id);
      const updateData = {
        ...request,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      await updateDoc(albumRef, updateData);

      const updatedAlbum = await this.getById(id);
      if (!updatedAlbum) {
        throw new Error('Album not found after update');
      }

      return updatedAlbum;
    } catch (error) {
      console.error(`Error updating album ${id}:`, error);
      throw new Error(`Failed to update album ${id}`);
    }
  }

  async delete(id: AlbumId): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Deletar o álbum
      const albumRef = doc(db, this.COLLECTION_NAME, id);
      batch.delete(albumRef);

      // Deletar todas as relações álbum-foto
      const photosRef = collection(db, this.ALBUM_PHOTOS_COLLECTION);
      const q = query(photosRef);
      const querySnapshot = await getDocs(q);

      querySnapshot.docs
        .filter(doc => doc.data().albumId === id)
        .forEach(doc => batch.delete(doc.ref));

      await batch.commit();
    } catch (error) {
      console.error(`Error deleting album ${id}:`, error);
      throw new Error(`Failed to delete album ${id}`);
    }
  }

  async addPhotoToAlbum(albumId: AlbumId, photoId: PhotoId): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Adicionar relação álbum-foto
      const albumPhotoRef = doc(collection(db, this.ALBUM_PHOTOS_COLLECTION));
      batch.set(albumPhotoRef, {
        albumId,
        photoId,
        addedAt: Timestamp.fromDate(new Date()),
      });

      // Atualizar contador do álbum
      const albumRef = doc(db, this.COLLECTION_NAME, albumId);
      const album = await this.getById(albumId);
      if (album) {
        batch.update(albumRef, {
          photoCount: album.photoCount + 1,
          updatedAt: Timestamp.fromDate(new Date()),
        });
      }

      await batch.commit();
    } catch (error) {
      console.error(`Error adding photo ${photoId} to album ${albumId}:`, error);
      throw new Error(`Failed to add photo to album`);
    }
  }

  async removePhotoFromAlbum(albumId: AlbumId, photoId: PhotoId): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Remover relação álbum-foto
      const photosRef = collection(db, this.ALBUM_PHOTOS_COLLECTION);
      const q = query(photosRef);
      const querySnapshot = await getDocs(q);

      const relationDoc = querySnapshot.docs.find(doc => {
        const data = doc.data();
        return data.albumId === albumId && data.photoId === photoId;
      });

      if (relationDoc) {
        batch.delete(relationDoc.ref);
      }

      // Atualizar contador do álbum
      const albumRef = doc(db, this.COLLECTION_NAME, albumId);
      const album = await this.getById(albumId);
      if (album) {
        batch.update(albumRef, {
          photoCount: Math.max(0, album.photoCount - 1),
          updatedAt: Timestamp.fromDate(new Date()),
        });
      }

      await batch.commit();
    } catch (error) {
      console.error(`Error removing photo ${photoId} from album ${albumId}:`, error);
      throw new Error(`Failed to remove photo from album`);
    }
  }

  async removeAllPhotoAssociations(photoId: PhotoId): Promise<void> {
    try {
      const batch = writeBatch(db);
      const photosRef = collection(db, this.ALBUM_PHOTOS_COLLECTION);
      const q = query(photosRef);
      const querySnapshot = await getDocs(q);

      const associationsToDelete = querySnapshot.docs.filter(doc => doc.data().photoId === photoId);

      for (const associationDoc of associationsToDelete) {
        batch.delete(associationDoc.ref);
        // Decrement photoCount in associated albums
        const albumId = associationDoc.data().albumId;
        const albumRef = doc(db, this.COLLECTION_NAME, albumId);
        const album = await this.getById(albumId);
        if (album) {
          batch.update(albumRef, {
            photoCount: Math.max(0, album.photoCount - 1),
            updatedAt: Timestamp.fromDate(new Date()),
          });
        }
      }
      await batch.commit();
    } catch (error) {
      console.error(`Error removing all associations for photo ${photoId}:`, error);
      throw new Error(`Failed to remove all associations for photo ${photoId}`);
    }
  }

  async movePhoto(operation: PhotoMoveOperation): Promise<void> {
    try {
      writeBatch(db);
// Remover da origem
      await this.removePhotoFromAlbum(operation.fromAlbumId, operation.photoId);

      // Adicionar ao destino
      await this.addPhotoToAlbum(operation.toAlbumId, operation.photoId);
    } catch (error) {
      console.error('Error moving photo:', error);
      throw new Error('Failed to move photo between albums');
    }
  }

  // Helper method para mapear documento do Firestore para Album
  private mapDocToAlbum(doc: any): Album {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      coverPhotoId: data.coverPhotoId,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      photoCount: data.photoCount || 0,
      tags: data.tags || [],
      isDefault: data.isDefault || false,
    };
  }
}

// Singleton instance (pode ser injetada via DI futuramente)
export const albumRepository: IAlbumRepository = new FirebaseAlbumRepository();

// Service facade para uso na aplicação
export class AlbumService {
  constructor(private repository: IAlbumRepository = albumRepository) {}

  // Delegação simples para o repository
  async getAllAlbums(): Promise<Album[]> {
    return this.repository.getAll();
  }

  async getAlbum(id: AlbumId): Promise<Album | null> {
    return this.repository.getById(id);
  }

  async getAlbumWithPhotos(id: AlbumId): Promise<AlbumWithPhotos | null> {
    return this.repository.getWithPhotos(id);
  }

  async createAlbum(request: CreateAlbumRequest): Promise<Album> {
    // Validação de negócio
    if (!request.name.trim()) {
      throw new Error('Album name is required');
    }

    if (request.name.length > 100) {
      throw new Error('Album name is too long');
    }

    return this.repository.create(request);
  }

  async updateAlbum(id: AlbumId, request: UpdateAlbumRequest): Promise<Album> {
    // Validação de negócio
    if (request.name !== undefined && !request.name.trim()) {
      throw new Error('Album name cannot be empty');
    }

    if (request.name && request.name.length > 100) {
      throw new Error('Album name is too long');
    }

    return this.repository.update(id, request);
  }

  async deleteAlbum(id: AlbumId): Promise<void> {
    // Verificar se não é álbum padrão
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

  async removeAllPhotoAssociations(photoId: PhotoId): Promise<void> {
    return this.repository.removeAllPhotoAssociations(photoId);
  }

  async movePhotoBetweenAlbums(operation: PhotoMoveOperation): Promise<void> {
    return this.repository.movePhoto(operation);
  }
}

// Instance padrão para uso na aplicação
export const albumService = new AlbumService();
