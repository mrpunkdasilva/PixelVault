/**
 * useAlbums Hook
 * Hook para gerenciamento de álbuns
 * Delegate para AlbumContext
 */

import { useAlbum } from '../contexts/AlbumContext';

export const useAlbums = () => {
  const context = useAlbum();
  
  return {
    albums: context.albums,
    loading: context.ui.isLoading,
    error: context.ui.error,
    createAlbum: context.createAlbum,
    updateAlbum: context.updateAlbum,
    deleteAlbum: context.deleteAlbum
  };
};