import { Photo } from '../types/Photo';
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { v4 as createId } from 'uuid';

const SUPPORTED_FILES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export const getAll = async () => {
  let list: Photo[] = [];

  const imagesFolder = ref(storage, 'images');
  const photoList = await listAll(imagesFolder);

  for (let i in photoList.items) {
    let photoUrl = await getDownloadURL(photoList.items[i]);

    list.push({
      name: photoList.items[i].name,
      url: photoUrl,
    });
  }

  return list;
};

export const insert = async (file: File) => {
  if (SUPPORTED_FILES.includes(file.type)) {
    let randomName = createId();
    let newFile = ref(storage, `images/${randomName}`);

    let upload = await uploadBytes(newFile, file);
    let photoUrl = await getDownloadURL(upload.ref);

    return { name: upload.ref.name, url: photoUrl } as Photo;
  } else {
    return new Error('Tipo de arquivo não permitido!');
  }
};
