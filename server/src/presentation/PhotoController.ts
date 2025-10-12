import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PhotoRepository, AlbumRepository } from '../application';
import { DeletePhoto } from '../application/DeletePhoto';
import { UpdateAlbumCover } from '../application/UpdateAlbumCover';
import { Photo, NotFoundError } from '../domain';

export class PhotoController {
  constructor(
    private photoRepository: PhotoRepository,
    private albumRepository: AlbumRepository
  ) {}

  async getByAlbumId(req: Request, res: Response): Promise<void> {
    try {
      const photos = await this.photoRepository.findByAlbumId(req.params.albumId);
      res.json(photos);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const photo = await this.photoRepository.findById(req.params.id);
      if (photo) {
        res.json(photo);
      } else {
        res.status(404).send('Photo not found');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { albumId } = req.params;
      const newPhoto: Photo = {
        id: uuidv4(),
        albumIds: [albumId],
        ...req.body,
        uploadedAt: new Date(),
      };
      await this.photoRepository.save(newPhoto);

      const album = await this.albumRepository.findById(albumId);
      if (album) {
        album.photoCount = (album.photoCount || 0) + 1;
        album.updatedAt = new Date();
        await this.albumRepository.save(album);
      }

      const updateAlbumCover = new UpdateAlbumCover(this.albumRepository, this.photoRepository);
      await updateAlbumCover.execute(albumId);

      res.status(201).json(newPhoto);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const photo = await this.photoRepository.findById(req.params.id);
      if (photo) {
        const updatedPhoto = { ...photo, ...req.body };
        await this.photoRepository.save(updatedPhoto);
        res.json(updatedPhoto);
      } else {
        res.status(4404).send('Photo not found');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const photo = await this.photoRepository.findById(req.params.id);
      if (!photo) {
        throw new NotFoundError('Photo not found');
      }

      const { albumIds } = photo;

      const deletePhoto = new DeletePhoto(this.photoRepository, this.albumRepository);
      await deletePhoto.execute(req.params.id);

      const updateAlbumCover = new UpdateAlbumCover(this.albumRepository, this.photoRepository);
      for (const albumId of albumIds) {
        await updateAlbumCover.execute(albumId);
      }

      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).send(error.message);
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }
}
