import { Album, AlbumId, Photo } from '../domain';
import { AlbumRepository } from '../application';
import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_PATH || path.join(__dirname, '..', '..', 'data');
const ALBUMS_FILE = path.join(DATA_DIR, 'albums.json');
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

export class FileSystemAlbumRepository implements AlbumRepository {
  async findAll(): Promise<Album[]> {
    const albums = readJsonFile(ALBUMS_FILE) as Album[];
    const photos = readJsonFile(PHOTOS_FILE) as Photo[];

    const photoCounts = photos.reduce((acc, photo) => {
      if (photo.albumIds && Array.isArray(photo.albumIds)) {
        photo.albumIds.forEach(albumId => {
          acc[albumId] = (acc[albumId] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    return albums.map(album => ({
      ...album,
      photoCount: photoCounts[album.id] || 0,
    }));
  }

  async findById(id: AlbumId): Promise<Album | null> {
    const albums = await this.findAll();
    return albums.find((album) => album.id === id) || null;
  }

  async save(album: Album): Promise<void> {
    const albums = await this.findAll();
    const index = albums.findIndex((a) => a.id === album.id);
    if (index !== -1) {
      albums[index] = album;
    } else {
      albums.push(album);
    }
    writeJsonFile(ALBUMS_FILE, albums);
  }

  async delete(id: AlbumId): Promise<void> {
    let albums = await this.findAll();
    albums = albums.filter((album) => album.id !== id);
    writeJsonFile(ALBUMS_FILE, albums);
  }
}
