export class FileValidator {
  private readonly ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  public isValid(file: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }

    if (!this.ALLOWED_MIMETYPES.includes(file.mimetype)) {
      return false;
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return false;
    }

    return true;
  }

  public getValidationErrorMessage(file: Express.Multer.File): string {
    if (!file) {
      return 'No file provided.';
    }

    if (!this.ALLOWED_MIMETYPES.includes(file.mimetype)) {
      return `Invalid file type. Only ${this.ALLOWED_MIMETYPES.join(', ')} are allowed.`;
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return `File size exceeds the limit of ${this.MAX_FILE_SIZE / (1024 * 1024)} MB.`;
    }

    return 'File is valid.';
  }
}
