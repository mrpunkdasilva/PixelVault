import { useState } from 'react';

import { Photo } from './types/Photo';
import './App.scss';

import { LogoWithText } from './components/LogoWithText';
import { ThemeToggle } from './components/ThemeToggle';
import { NotificationContainer } from './components/NotificationContainer';
import { useNotificationHelpers } from './contexts/NotificationContext';
import { PhotoModal, KeyboardShortcutsHelp } from './components/LazyComponent';
import { useKeyboardShortcuts, KeyboardShortcut } from './hooks/useKeyboardShortcuts';
import { useTheme } from './contexts/ThemeContext';

// Album System imports
import { AlbumProvider } from './contexts/AlbumContext';
import { AlbumCarousel3D } from './components/AlbumCarousel3D';
import { AlbumForm } from './components/AlbumForm';
import { AlbumView } from './components/AlbumView';

import { Breadcrumbs } from './components/Breadcrumbs';

// Navigation system
import { useNavigation, useBreadcrumbs } from './hooks/useNavigation';
import { useAlbums } from './hooks/useAlbums';
import { usePhotos } from './hooks/usePhotos';

// Main App component wrapped with providers
function AppContent() {
  // Legacy photo state (for backward compatibility)
  const [uploading, setUploading] = useState(false);
  // const [loading, setLoading] = useState(false); // Removed
  // const [photos, setPhotos] = useState<Photo[]>([]); // Removed
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Album system state
  const [isAlbumFormOpen, setIsAlbumFormOpen] = useState(false);

  // Hooks
  const { showSuccess, showError } = useNotificationHelpers();
  const { toggleTheme } = useTheme();
  const navigation = useNavigation();
  const { albums } = useAlbums();
  const { deletePhoto: deletePhotoFromHook, addPhoto } = usePhotos(); // Added addPhoto
  const breadcrumbs = useBreadcrumbs(navigation.navigationState, albums);

  // Modal handlers
  const toggleHelp = () => setIsHelpOpen(!isHelpOpen);
  const closeHelp = () => setIsHelpOpen(false);

  // Album-related handlers
  const handleCreateAlbum = () => setIsAlbumFormOpen(true);
  const handleAlbumFormClose = () => setIsAlbumFormOpen(false);

  // Navigation handlers
  const handleNavigate = (view: any, albumId?: string) => {
    switch (view) {
      case 'photos':
        navigation.goToPhotos();
        break;
      case 'albums':
        navigation.goToAlbums();
        break;
      case 'album-detail':
        if (albumId) navigation.goToAlbum(albumId);
        break;
    }
  };

  // Updated keyboard shortcuts for new navigation system
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Escape',
      action: () => {
        if (isModalOpen) {
          handleCloseModal();
        } else if (isHelpOpen) {
          closeHelp();
        } else if (isAlbumFormOpen) {
          handleAlbumFormClose();
        } else if (navigation.canGoBack) {
          navigation.goBack();
        }
      },
      description: 'Close modal, dialog, or go back',
    },
    {
      key: 'd',
      ctrlKey: true,
      action: event => {
        event?.preventDefault();
        toggleTheme();
      },
      description: 'Toggle theme (Dark/Light)',
    },
    {
      key: 'u',
      ctrlKey: true,
      action: event => {
        event?.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = e => {
          const files = Array.from((e.target as HTMLInputElement).files || []);
          if (files.length === 1) {
            handleFileSelect(files[0]);
          } else if (files.length > 1) {
            handleMultipleFilesSelect(files);
          }
        };
        input.click();
      },
      description: 'Upload new photo(s)',
    },
    {
      key: 'a',
      ctrlKey: true,
      action: event => {
        event?.preventDefault();
        handleCreateAlbum();
      },
      description: 'Create new album',
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
      action: event => {
        event?.preventDefault();
        toggleHelp();
      },
      description: 'Show keyboard shortcuts help',
      preventDefault: true,
    },
  ];

  useKeyboardShortcuts(shortcuts);

  // Removed useEffect for Photos.getAll()
  // useEffect(() => {
  //   const getPhotos = async () => {
  //     setLoading(true);
  //     setPhotos(await Photos.getAll());
  //     setLoading(false);
  //   };

  //   getPhotos();
  // }, []);

  const handleFileSelect = async (file: File) => {
    setUploading(true);
    // Assuming a default album for uploads if not in an album view
    const targetAlbumId = navigation.navigationState.albumId || 'default-album-id'; // TODO: Replace with actual default album ID logic
    let result = await addPhoto(file, targetAlbumId); // Updated to use addPhoto from usePhotos
    setUploading(false);

    if (result instanceof Error) {
      showError('Upload Failed', result.message);
    } else {
      // Photos are now managed by usePhotos hook, no need to update local state directly
      showSuccess('Photo Uploaded', 'Your photo has been successfully uploaded!');
    }
  };

  const handleMultipleFilesSelect = async (files: File[]) => {
    setUploading(true);
    let successCount = 0;
    let errorCount = 0;
    // Assuming a default album for uploads if not in an album view
    const targetAlbumId = navigation.navigationState.albumId || 'default-album-id'; // TODO: Replace with actual default album ID logic

    for (const file of files) {
      try {
        let result = await addPhoto(file, targetAlbumId); // Updated to use addPhoto from usePhotos
        if (result instanceof Error) {
          errorCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    setUploading(false);

    // Show appropriate notification
    if (successCount > 0 && errorCount === 0) {
      showSuccess(
        'Photos Uploaded',
        `${successCount} photo${successCount > 1 ? 's' : ''} uploaded successfully!`,
      );
    } else if (successCount > 0 && errorCount > 0) {
      showError('Partial Upload', `${successCount} photos uploaded, ${errorCount} failed`);
    } else {
      showError('Upload Failed', 'All uploads failed');
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = async (photoToDelete: Photo) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${photoToDelete.name}"?`,
    );
    if (confirmDelete) {
      try {
        await deletePhotoFromHook(photoToDelete.id);
        // setPhotos(photos.filter(photo => photo.id !== photoToDelete.id)); // Removed
        if (selectedPhoto?.id === photoToDelete.id) {
          handleCloseModal();
        }
        showSuccess('Photo Deleted', `"${photoToDelete.name}" has been deleted successfully.`);
      } catch (error) {
        showError('Delete Failed', `Failed to delete "${photoToDelete.name}".`);
        console.error('Error deleting photo from App.tsx:', error);
      }
    }
  };

  // Render the appropriate content based on navigation state
  const renderContent = () => {
    switch (navigation.navigationState.view) {
      case 'photos': // This case will now display albums by default
        return (
          <AlbumCarousel3D onAlbumClick={navigation.goToAlbum} onCreateAlbum={handleCreateAlbum} />
        );

      case 'albums':
        return (
          <AlbumCarousel3D onAlbumClick={navigation.goToAlbum} onCreateAlbum={handleCreateAlbum} />
        );

      case 'album-detail':
        return navigation.navigationState.albumId ? (
          <AlbumView
            albumId={navigation.navigationState.albumId}
            onBackToAlbums={navigation.goToAlbums}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className='container'>
      {/* Header - Full Width */}
      <div className='header'>
        <div className='header-inner'>
          <LogoWithText size={70} showSubtext={true} />
          <div className='header-controls'>
            <KeyboardShortcutsHelp
              shortcuts={shortcuts}
              isOpen={isHelpOpen}
              onToggle={toggleHelp}
              onClose={closeHelp}
            />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Centralized Content Area */}
      <div className='area'>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={breadcrumbs}
          onNavigate={handleNavigate}
          canGoBack={navigation.canGoBack}
          onGoBack={navigation.goBack}
        />

        {/* Main Content Area */}
        <div className='main-content'>{renderContent()}</div>
      </div>

      {/* Modals */}
      <PhotoModal
        isOpen={isModalOpen}
        imageUrl={selectedPhoto?.url || ''}
        imageName={selectedPhoto?.name || ''}
        onClose={handleCloseModal}
        onDelete={selectedPhoto ? () => handleDeletePhoto(selectedPhoto) : undefined}
      />

      {/* Album Form Modal */}
      {isAlbumFormOpen && (
        <div className='modal-overlay' onClick={handleAlbumFormClose}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <AlbumForm
              mode='create'
              onSuccess={album => {
                console.log('Album created:', album);
                handleAlbumFormClose();
                showSuccess('Album Created', `"${album.name}" has been created successfully.`);
              }}
              onCancel={handleAlbumFormClose}
            />
          </div>
        </div>
      )}

      <NotificationContainer />
    </div>
  );
}

// Main App component with providers
export default function App() {
  return (
    <AlbumProvider>
      <AppContent />
    </AlbumProvider>
  );
}
