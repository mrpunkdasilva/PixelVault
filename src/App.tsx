import { useState, useEffect } from 'react';

import { Photo } from './types/Photo';
import './App.scss';

import * as Photos from './services/photos';
import { PhotoItem } from './components/PhotoItem';
import { LogoWithText } from './components/LogoWithText';
import { LoadingLogo } from './components/LoadingLogo';
import { UploadZone } from './components/UploadZone';
import { ThemeToggle } from './components/ThemeToggle';
import { NotificationContainer } from './components/NotificationContainer';
import { useNotificationHelpers } from './contexts/NotificationContext';
import { PhotoModal, KeyboardShortcutsHelp } from './components/LazyComponents';
import { useKeyboardShortcuts, KeyboardShortcut } from './hooks/useKeyboardShortcuts';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { showSuccess, showError } = useNotificationHelpers();
  const { toggleTheme } = useTheme();

  // Help modal functions
  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  // Keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Escape',
      action: () => {
        if (isModalOpen) {
          handleCloseModal();
        } else if (isHelpOpen) {
          closeHelp();
        }
      },
      description: 'Close modal or dialog',
    },
    {
      key: 'd',
      ctrlKey: true,
      action: (event) => {
        event?.preventDefault();
        toggleTheme();
      },
      description: 'Toggle theme (Dark/Light)',
    },
    {
      key: 'u',
      ctrlKey: true,
      action: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        };
        input.click();
      },
      description: 'Upload new photo',
    },
    {
      key: 'r',
      ctrlKey: true,
      action: () => {
        window.location.reload();
      },
      description: 'Refresh page',
      preventDefault: false,
    },
    {
      key: 'h',
      ctrlKey: true,
      action: () => {
        toggleHelp();
      },
      description: 'Show keyboard shortcuts help',
      preventDefault: true,
    },
  ];

  useKeyboardShortcuts(shortcuts);

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
      showError('Upload Failed', result.message);
    } else {
      let newPhotoList = [...photos];
      newPhotoList.unshift(result); // Add to beginning for better UX
      setPhotos(newPhotoList);
      showSuccess('Photo Uploaded', 'Your photo has been successfully uploaded!');
    }
  }

  const handleMultipleFilesSelect = async (files: File[]) => {
    setUploading(true);
    let successCount = 0;
    let errorCount = 0;
    let newPhotoList = [...photos];

    for (const file of files) {
      try {
        let result = await Photos.insert(file);
        if (result instanceof Error) {
          errorCount++;
        } else {
          newPhotoList.unshift(result); // Add to beginning for better UX
          successCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    setUploading(false);
    setPhotos(newPhotoList);

    // Show appropriate notification
    if (successCount > 0 && errorCount === 0) {
      showSuccess(
        'Photos Uploaded', 
        `${successCount} photo${successCount > 1 ? 's' : ''} uploaded successfully!`
      );
    } else if (successCount > 0 && errorCount > 0) {
      showError(
        'Partial Upload', 
        `${successCount} photos uploaded, ${errorCount} failed`
      );
    } else {
      showError('Upload Failed', 'All uploads failed');
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
      showSuccess('Photo Deleted', `"${photoToDelete.name}" has been deleted successfully.`);
    }
  }

  return (
    <div className="container">
      <div className="area">
        <div className="header">
          <LogoWithText size={70} showSubtext={true} />
          <div className="header-controls">
            <KeyboardShortcutsHelp 
              shortcuts={shortcuts} 
              isOpen={isHelpOpen}
              onToggle={toggleHelp}
              onClose={closeHelp}
            />
            <ThemeToggle />
          </div>
        </div>

        <UploadZone 
          onFileSelect={handleFileSelect}
          onMultipleFilesSelect={handleMultipleFilesSelect}
          uploading={uploading}
          enableCompression={true}
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
      
      <NotificationContainer />
    </div>
  );
}

export default App;