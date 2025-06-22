/**
 * useNavigation Hook
 * Sistema de navegação simples para o PixelVault
 * Gerencia estado da navegação sem router completo
 */

import { useState, useCallback, useEffect } from 'react';

export type NavigationView = 'photos' | 'albums' | 'album-detail';

export interface NavigationState {
  view: NavigationView;
  albumId?: string;
  previousView?: NavigationView;
  previousAlbumId?: string;
}

export interface NavigationActions {
  goToPhotos: () => void;
  goToAlbums: () => void;
  goToAlbum: (albumId: string) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const INITIAL_STATE: NavigationState = {
  view: 'photos',
  albumId: undefined,
  previousView: undefined,
  previousAlbumId: undefined
};

export const useNavigation = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>(INITIAL_STATE);

  // Actions
  const goToPhotos = useCallback(() => {
    setNavigationState(prev => ({
      view: 'photos',
      albumId: undefined,
      previousView: prev.view,
      previousAlbumId: prev.albumId
    }));
  }, []);

  const goToAlbums = useCallback(() => {
    setNavigationState(prev => ({
      view: 'albums',
      albumId: undefined,
      previousView: prev.view,
      previousAlbumId: prev.albumId
    }));
  }, []);

  const goToAlbum = useCallback((albumId: string) => {
    setNavigationState(prev => ({
      view: 'album-detail',
      albumId,
      previousView: prev.view,
      previousAlbumId: prev.albumId
    }));
  }, []);

  const goBack = useCallback(() => {
    setNavigationState(prev => {
      if (prev.previousView) {
        return {
          view: prev.previousView,
          albumId: prev.previousAlbumId,
          previousView: undefined,
          previousAlbumId: undefined
        };
      }
      return prev;
    });
  }, []);

  const canGoBack = navigationState.previousView !== undefined;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt + Left Arrow = Go back
      if (e.altKey && e.key === 'ArrowLeft' && canGoBack) {
        e.preventDefault();
        goBack();
      }
      
      // Ctrl + 1 = Photos view
      if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        goToPhotos();
      }
      
      // Ctrl + 2 = Albums view
      if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        goToAlbums();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canGoBack, goBack, goToPhotos, goToAlbums]);

  // Browser back/forward (optional - basic history support)
  useEffect(() => {
    const handlePopState = () => {
      // In a real app, this would sync with browser history
      // For now, we'll just handle the back action
      if (canGoBack) {
        goBack();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [canGoBack, goBack]);

  const actions: NavigationActions = {
    goToPhotos,
    goToAlbums,
    goToAlbum,
    goBack,
    canGoBack
  };

  return {
    navigationState,
    ...actions
  };
};

// Helper hook for breadcrumbs
export const useBreadcrumbs = (navigationState: NavigationState, albums: any[] = []) => {
  const breadcrumbs = [];

  // Always start with Home
  breadcrumbs.push({
    label: 'Home',
    view: 'photos' as NavigationView,
    albumId: undefined
  });

  if (navigationState.view === 'albums') {
    breadcrumbs.push({
      label: 'Albums',
      view: 'albums' as NavigationView,
      albumId: undefined
    });
  }

  if (navigationState.view === 'album-detail' && navigationState.albumId) {
    breadcrumbs.push({
      label: 'Albums',
      view: 'albums' as NavigationView,
      albumId: undefined
    });

    const album = albums.find(a => a.id === navigationState.albumId);
    if (album) {
      breadcrumbs.push({
        label: album.name,
        view: 'album-detail' as NavigationView,
        albumId: album.id
      });
    }
  }

  return breadcrumbs;
};