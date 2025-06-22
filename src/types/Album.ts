/**
 * Album Domain Model
 * Representa um álbum de fotos com todas suas propriedades e relacionamentos
 */

export type AlbumId = string;
export type PhotoId = string;

export interface Album {
  id: AlbumId;
  name: string;
  description?: string;
  coverPhotoId?: PhotoId;
  createdAt: Date;
  updatedAt: Date;
  photoCount: number;
  tags: string[];
  isDefault?: boolean; // Para o álbum "Todas as Fotos"
}

export interface CreateAlbumRequest {
  name: string;
  description?: string;
  coverPhotoId?: PhotoId;
  tags?: string[];
}

export interface UpdateAlbumRequest {
  name?: string;
  description?: string;
  coverPhotoId?: PhotoId;
  tags?: string[];
}

export interface AlbumWithPhotos extends Album {
  photos: PhotoId[];
}

// Estados da UI
export interface AlbumUIState {
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

// Para operações de drag and drop
export interface PhotoMoveOperation {
  photoId: PhotoId;
  fromAlbumId: AlbumId;
  toAlbumId: AlbumId;
  position?: number;
}