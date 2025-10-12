import { AlbumRepository } from './AlbumRepository';
import { PhotoRepository } from './PhotoRepository';
import { AlbumId } from '../domain';

export class DeleteAlbum {
  constructor(
    private albumRepository: AlbumRepository,
    private photoRepository: PhotoRepository
  ) {}

  async execute(albumId: AlbumId): Promise<void> {
    const photos = await this.photoRepository.findByAlbumId(albumId);
    for (const photo of photos) {
      photo.albumIds = photo.albumIds.filter((id) => id !== albumId);
      await this.photoRepository.save(photo);
    }
    await this.albumRepository.delete(albumId);
  }
}
