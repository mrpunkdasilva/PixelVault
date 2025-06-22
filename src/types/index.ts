/**
 * Type Index
 * Centralizador de tipos para facilitar imports e manter organização
 */

// Domain Models
export type { 
  Photo, 
  PhotoId, 
  PhotoMetadata, 
  ExifData, 
  PhotoUploadRequest, 
  PhotoUploadProgress,
  LegacyPhoto 
} from './Photo';

export type { 
  Album, 
  AlbumId, 
  CreateAlbumRequest, 
  UpdateAlbumRequest, 
  AlbumWithPhotos, 
  AlbumUIState, 
  PhotoMoveOperation 
} from './Album';

// Re-export para compatibilidade com código existente
export type { LegacyPhoto as Photo } from './Photo';