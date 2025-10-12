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
