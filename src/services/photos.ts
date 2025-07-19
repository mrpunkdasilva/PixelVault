import { Photo, PhotoId } from '../types/Photo';
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 as createId } from 'uuid';

const SUPPORTED_FILES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export const getAll = async (): Promise<Photo[]> => {
  let list: Photo[] = [];

  const imagesFolder = ref(storage, 'images');
  const photoList = await listAll(imagesFolder);

  for (let i in photoList.items) {
    const photoRef = photoList.items[i];
    const photoUrl = await getDownloadURL(photoRef);

    // Placeholder values for fields not available directly from Firebase Storage
    list.push({
      id: photoRef.name, // Using Firebase Storage name as ID
      name: photoRef.name,
      url: photoUrl,
      albumIds: [], // Will be populated by Firestore data
      uploadedAt: new Date(), // Placeholder
      size: 0, // Placeholder
      mimeType: '', // Placeholder
      tags: [], // Placeholder
    });
  }

  return list;
};

export const insert = async (file: File): Promise<Photo | Error> => {
  if (SUPPORTED_FILES.includes(file.type)) {
    const randomName = createId();
    const newFileRef = ref(storage, `images/${randomName}`);

    const uploadResult = await uploadBytes(newFileRef, file);
    const photoUrl = await getDownloadURL(uploadResult.ref);

    // Placeholder values for fields not available directly from Firebase Storage
    return {
      id: uploadResult.ref.name, // Using Firebase Storage name as ID
      name: uploadResult.ref.name,
      url: photoUrl,
      albumIds: [], // Will be populated by Firestore data
      uploadedAt: new Date(), // Placeholder
      size: file.size, // Can get size from file object
      mimeType: file.type, // Can get mimeType from file object
      tags: [], // Placeholder
    };
  } else {
    return new Error('Tipo de arquivo não permitido!');
  }
};

export const deletePhoto = async (photoId: PhotoId): Promise<void> => {
  try {
    const photoRef = ref(storage, `images/${photoId}`);
    await deleteObject(photoRef);
  } catch (error) {
    console.error(`Error deleting photo ${photoId} from storage:`, error);
    throw new Error(`Failed to delete photo ${photoId} from storage`);
  }
};
