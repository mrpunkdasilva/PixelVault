import { Album, AlbumId } from '../domain';

export interface AlbumRepository {
  findAll(): Promise<Album[]>;
  findById(id: AlbumId): Promise<Album | null>;
  save(album: Album): Promise<void>;
  delete(id: AlbumId): Promise<void>;
}
