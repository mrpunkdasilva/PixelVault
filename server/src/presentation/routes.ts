import { Router } from 'express';
import { AlbumController } from './AlbumController';
import { PhotoController } from './PhotoController';
import { UploadController } from './UploadController';
import { FileSystemAlbumRepository, FileSystemPhotoRepository } from '../infrastructure';
import multer from 'multer';
import path from 'path';

const router = Router();

const albumRepository = new FileSystemAlbumRepository();
const photoRepository = new FileSystemPhotoRepository();

const albumController = new AlbumController(albumRepository, photoRepository);
const photoController = new PhotoController(photoRepository, albumRepository); // Pass albumRepository
const uploadController = new UploadController();

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });


// Album routes
router.get('/albums', (req, res) => albumController.getAll(req, res));
router.get('/albums/:id', (req, res) => albumController.getById(req, res));
router.post('/albums', (req, res) => albumController.create(req, res));
router.put('/albums/:id', (req, res) => albumController.update(req, res));
router.delete('/albums/:id', (req, res) => albumController.delete(req, res));

// Photo routes
router.get('/albums/:albumId/photos', (req, res) => photoController.getByAlbumId(req, res));
router.get('/photos/:id', (req, res) => photoController.getById(req, res));
router.post('/albums/:albumId/photos', (req, res) => photoController.create(req, res));
router.put('/photos/:id', (req, res) => photoController.update(req, res));
router.delete('/photos/:id', (req, res) => photoController.delete(req, res));

// Upload routes
router.post('/photos/upload', upload.single('image'), (req, res) => uploadController.uploadImage(req, res));


export default router;
