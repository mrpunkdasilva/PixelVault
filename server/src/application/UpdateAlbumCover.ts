
import { AlbumRepository } from './AlbumRepository';
import { PhotoRepository } from './PhotoRepository';
import { AlbumId } from '../domain';

export class UpdateAlbumCover {
  constructor(
    private albumRepository: AlbumRepository,
    private photoRepository: PhotoRepository
  ) {}

  async execute(albumId: AlbumId): Promise<void> {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      // Album not found, nothing to do
      return;
    }

    const photos = await this.photoRepository.findByAlbumId(albumId);
    
    // Sort photos by uploadedAt date to determine the first photo
    photos.sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime());

    const firstPhoto = photos[0];
    
    if (firstPhoto) {
      album.coverPhotoId = firstPhoto.id;
    } else {
      album.coverPhotoId = undefined;
    }

    console.log('Saving album with coverPhotoId:', album);
    await this.albumRepository.save(album);
  }
}
