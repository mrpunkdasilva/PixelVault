import { Photo, PhotoId, AlbumId } from '../domain';
import { PhotoRepository } from '../application';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');

const readJsonFile = (filePath: string): any[] => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeJsonFile = (filePath: string, data: any): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

export class FileSystemPhotoRepository implements PhotoRepository {
  async findByAlbumId(albumId: AlbumId): Promise<Photo[]> {
    const photos = await this.findAll();
    return photos.filter((photo) => photo.albumIds.includes(albumId));
  }

  async findById(id: PhotoId): Promise<Photo | null> {
    const photos = await this.findAll();
    return photos.find((photo) => photo.id === id) || null;
  }

  async save(photo: Photo): Promise<void> {
    const photos = await this.findAll();
    const index = photos.findIndex((p) => p.id === photo.id);
    if (index !== -1) {
      photos[index] = photo;
    } else {
      photos.push(photo);
    }
    writeJsonFile(PHOTOS_FILE, photos);
  }

  async delete(id: PhotoId): Promise<void> {
    let photos = await this.findAll();
    photos = photos.filter((photo) => photo.id !== id);
    writeJsonFile(PHOTOS_FILE, photos);
  }

  private async findAll(): Promise<Photo[]> {
    return readJsonFile(PHOTOS_FILE) as Photo[];
  }
}
