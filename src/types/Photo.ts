/**
 * Photo Domain Model
 * Modelo de domínio enriquecido para fotos com metadados e relacionamentos
 */

export type PhotoId = string;
export type AlbumId = string;

export interface Photo {
  id: PhotoId;
  name: string;
  url: string;
  thumbnailUrl?: string;
  albumIds: AlbumId[]; // Uma foto pode estar em múltiplos álbuns
  uploadedAt: Date;
  size: number; // em bytes
  mimeType: string;
  tags: string[];
  metadata?: PhotoMetadata;
}

export interface PhotoMetadata {
  width: number;
  height: number;
  fileSize: number;
  originalName: string;
  exif?: ExifData;
}

export interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  date?: Date;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

// Para upload
export interface PhotoUploadRequest {
  file: File;
  albumId?: AlbumId;
  tags?: string[];
}

export interface PhotoUploadProgress {
  photoId: PhotoId;
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Legacy type para compatibilidade (será removido gradualmente)
export type LegacyPhoto = {
  name: string;
  url: string;
};
