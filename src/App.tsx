import { useState, useEffect } from 'react';

import { Photo } from './types/Photo';
import './App.scss';

import * as Photos from './services/photos';
import { PhotoItem } from './components/PhotoItem';
import { LogoWithText } from './components/LogoWithText';
import { LoadingLogo } from './components/LoadingLogo';
import { UploadZone } from './components/UploadZone';
import { PhotoModal } from './components/PhotoModal';

function App() {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);
      setPhotos(await Photos.getAll());
      setLoading(false);
    }

    getPhotos();
  }, [])

  const handleFileSelect = async (file: File) => {
    setUploading(true);
    let result = await Photos.insert(file);
    setUploading(false);

    if (result instanceof Error) {
      alert(`${result.name} - ${result.message}`);
    } else {
      let newPhotoList = [...photos];
      newPhotoList.unshift(result); // Add to beginning for better UX
      setPhotos(newPhotoList);
    }
  }

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  }

  const handleDeletePhoto = async (photoToDelete: Photo) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${photoToDelete.name}"?`);
    if (confirmDelete) {
      // Here you would typically call a delete API
      // For now, we'll just remove it from the local state
      setPhotos(photos.filter(photo => photo.url !== photoToDelete.url));
      if (selectedPhoto?.url === photoToDelete.url) {
        handleCloseModal();
      }
    }
  }

  return (
    <div className="container">
      <div className="area">
        <div className="header">
          <LogoWithText size={70} showSubtext={true} />
        </div>

        <UploadZone 
          onFileSelect={handleFileSelect}
          uploading={uploading}
        />

        {loading &&
          <div className="screen-warning">
            <LoadingLogo size={80} />
            <div className="loading-text">Loading your photos...</div>
          </div>
        }

        {!loading && photos.length > 0 &&
          <div className="photo-list">
            {photos.map((item, index) => (
              <PhotoItem 
                key={index} 
                url={item.url} 
                name={item.name}
                onClick={() => handlePhotoClick(item)}
                onDelete={() => handleDeletePhoto(item)}
              />
            ))}
          </div>
        }

        {!loading && photos.length === 0 &&
          <div className="screen-warning">
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor" opacity="0.6"/>
                </svg>
              </div>
              <h3>No photos yet</h3>
              <p>Upload your first photo to get started!</p>
            </div>
          </div>
        }

        <PhotoModal 
          isOpen={isModalOpen}
          imageUrl={selectedPhoto?.url || ''}
          imageName={selectedPhoto?.name || ''}
          onClose={handleCloseModal}
          onDelete={selectedPhoto ? () => handleDeletePhoto(selectedPhoto) : undefined}
        />
      </div>
    </div>
  );
}

export default App;