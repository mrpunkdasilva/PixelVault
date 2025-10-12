import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class FileService {
  public generateUniqueFilename(originalname: string): string {
    const uniqueSuffix = uuidv4();
    const fileExtension = path.extname(originalname);
    const baseFilename = path.basename(originalname, fileExtension);
    const sanitizedBaseFilename = this.sanitizeFilename(baseFilename);
    return `${uniqueSuffix}-${sanitizedBaseFilename}${fileExtension}`;
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9_.-]/g, '') // Remove invalid characters
      .replace(/(\s|\.)/g, '-') // Replace spaces and dots with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with a single one
      .toLowerCase(); // Convert to lowercase
  }
}
