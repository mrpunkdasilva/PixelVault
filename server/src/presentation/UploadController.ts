import { Request, Response } from 'express';

export class UploadController {
  uploadImage(req: Request, res: Response): void {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    res.status(200).json({ message: 'File uploaded successfully', imageUrl, filename: req.file.filename });
  }
}
