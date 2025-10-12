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
