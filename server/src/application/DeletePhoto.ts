import { AlbumRepository, PhotoRepository } from '../application';
import { PhotoId } from '../domain';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

export class DeletePhoto {
  constructor(
    private photoRepository: PhotoRepository,
    private albumRepository: AlbumRepository
  ) {}

  async execute(photoId: PhotoId): Promise<void> {
    const photo = await this.photoRepository.findById(photoId);
    if (photo) {
      await this.photoRepository.delete(photoId);

      // Delete the physical file
      const photoPath = path.join(UPLOADS_DIR, path.basename(photo.url));
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }

      // Update associated albums
      for (const albumId of photo.albumIds) {
        const album = await this.albumRepository.findById(albumId);
        if (album) {
          album.photoCount = Math.max(0, (album.photoCount || 1) - 1);
          album.updatedAt = new Date();
          await this.albumRepository.save(album);
        }
      }
    }
  }
}
