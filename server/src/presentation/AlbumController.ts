import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AlbumRepository, PhotoRepository, CreateAlbumRequest, UpdateAlbumRequest } from '../application';
import { DeleteAlbum } from '../application/DeleteAlbum';
import { Album, NotFoundError } from '../domain';

export class AlbumController {
  constructor(
    private albumRepository: AlbumRepository,
    private photoRepository: PhotoRepository
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const albums = await this.albumRepository.findAll();
      res.json(albums);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const album = await this.albumRepository.findById(req.params.id);
      if (album) {
        res.json(album);
      } else {
        res.status(404).send('Album not found');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const createRequest: CreateAlbumRequest = req.body;
      const newAlbum: Album = {
        id: uuidv4(),
        name: createRequest.name,
        description: createRequest.description,
        coverPhotoId: createRequest.coverPhotoId,
        tags: createRequest.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        photoCount: 0,
      };
      await this.albumRepository.save(newAlbum);
      res.status(201).json(newAlbum);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updateRequest: UpdateAlbumRequest = req.body;
      const album = await this.albumRepository.findById(req.params.id);
      if (album) {
        const updatedAlbum: Album = {
          ...album,
          ...updateRequest,
          updatedAt: new Date(),
        };
        await this.albumRepository.save(updatedAlbum);
        res.json(updatedAlbum);
      } else {
        res.status(404).send('Album not found');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleteAlbum = new DeleteAlbum(this.albumRepository, this.photoRepository);
      await deleteAlbum.execute(req.params.id);
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
