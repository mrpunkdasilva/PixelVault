import { Photo, PhotoId, AlbumId } from '../domain';

export interface PhotoRepository {
  findByAlbumId(albumId: AlbumId): Promise<Photo[]>;
  findById(id: PhotoId): Promise<Photo | null>;
  save(photo: Photo): Promise<void>;
  delete(id: PhotoId): Promise<void>;
}
