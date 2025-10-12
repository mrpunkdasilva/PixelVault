import { AlbumId, PhotoId } from '../domain';

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
