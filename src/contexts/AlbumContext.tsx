/**
 * Album Context
 * Context API implementation seguindo Observer pattern para estado global dos álbuns
 * Responsabilidade única: gerenciar estado e operações de álbuns
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { albumService } from '../services/albums';
import { useNotificationHelpers } from './NotificationContext';
import type {
  Album,
  AlbumId,
  CreateAlbumRequest,
  UpdateAlbumRequest,
  AlbumWithPhotos,
  PhotoId,
  PhotoMoveOperation,
  AlbumUIState,
} from '../types';

// State interface
interface AlbumState {
  albums: Album[];
  currentAlbum: AlbumWithPhotos | null;
  ui: AlbumUIState;
}

// Actions (Command Pattern)
type AlbumAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CREATING'; payload: boolean }
  | { type: 'SET_UPDATING'; payload: boolean }
  | { type: 'SET_DELETING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ALBUMS'; payload: Album[] }
  | { type: 'ADD_ALBUM'; payload: Album }
  | { type: 'UPDATE_ALBUM'; payload: Album }
  | { type: 'REMOVE_ALBUM'; payload: AlbumId }
  | { type: 'SET_CURRENT_ALBUM'; payload: AlbumWithPhotos | null }
  | { type: 'ADD_PHOTO_TO_CURRENT_ALBUM'; payload: PhotoId }
  | { type: 'REMOVE_PHOTO_FROM_CURRENT_ALBUM'; payload: PhotoId };

// Context interface
interface AlbumContextType extends AlbumState {
  // Album operations
  loadAlbums: () => Promise<void>;
  loadAlbum: (id: AlbumId) => Promise<void>;
  createAlbum: (request: CreateAlbumRequest) => Promise<Album>;
  updateAlbum: (id: AlbumId, request: UpdateAlbumRequest) => Promise<void>;
  deleteAlbum: (id: AlbumId) => Promise<void>;

  // Photo operations
  addPhotoToAlbum: (albumId: AlbumId, photoId: PhotoId) => Promise<void>;
  removePhotoFromAlbum: (albumId: AlbumId, photoId: PhotoId) => Promise<void>;
  movePhotoBetweenAlbums: (operation: PhotoMoveOperation) => Promise<void>;

  // Utility
  clearError: () => void;
  getAlbumById: (id: AlbumId) => Album | undefined;
}

// Initial state
const initialState: AlbumState = {
  albums: [],
  currentAlbum: null,
  ui: {
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
  },
};

// Reducer (State Machine Pattern)
function albumReducer(state: AlbumState, action: AlbumAction): AlbumState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        ui: { ...state.ui, isLoading: action.payload },
      };

    case 'SET_CREATING':
      return {
        ...state,
        ui: { ...state.ui, isCreating: action.payload },
      };

    case 'SET_UPDATING':
      return {
        ...state,
        ui: { ...state.ui, isUpdating: action.payload },
      };

    case 'SET_DELETING':
      return {
        ...state,
        ui: { ...state.ui, isDeleting: action.payload },
      };

    case 'SET_ERROR':
      return {
        ...state,
        ui: { ...state.ui, error: action.payload },
      };

    case 'SET_ALBUMS':
      return {
        ...state,
        albums: action.payload,
      };

    case 'ADD_ALBUM':
      return {
        ...state,
        albums: [action.payload, ...state.albums],
      };

    case 'UPDATE_ALBUM':
      return {
        ...state,
        albums: state.albums.map(album =>
          album.id === action.payload.id ? action.payload : album,
        ),
        currentAlbum:
          state.currentAlbum?.id === action.payload.id
            ? { ...state.currentAlbum, ...action.payload }
            : state.currentAlbum,
      };

    case 'REMOVE_ALBUM':
      return {
        ...state,
        albums: state.albums.filter(album => album.id !== action.payload),
        currentAlbum: state.currentAlbum?.id === action.payload ? null : state.currentAlbum,
      };

    case 'SET_CURRENT_ALBUM':
      return {
        ...state,
        currentAlbum: action.payload,
      };

    case 'ADD_PHOTO_TO_CURRENT_ALBUM':
      if (!state.currentAlbum) return state;
      return {
        ...state,
        currentAlbum: {
          ...state.currentAlbum,
          photos: [action.payload, ...state.currentAlbum.photos],
          photoCount: state.currentAlbum.photoCount + 1,
        },
      };

    case 'REMOVE_PHOTO_FROM_CURRENT_ALBUM':
      if (!state.currentAlbum) return state;
      return {
        ...state,
        currentAlbum: {
          ...state.currentAlbum,
          photos: state.currentAlbum.photos.filter(id => id !== action.payload),
          photoCount: Math.max(0, state.currentAlbum.photoCount - 1),
        },
      };

    default:
      return state;
  }
}

// Context creation
const AlbumContext = createContext<AlbumContextType | undefined>(undefined);

// Provider component
interface AlbumProviderProps {
  children: React.ReactNode;
}

export function AlbumProvider({ children }: AlbumProviderProps) {
  const [state, dispatch] = useReducer(albumReducer, initialState);
  const { showSuccess, showError } = useNotificationHelpers();

  // Error handler (Higher-Order Function)
  const withErrorHandling = useCallback(
    <T extends any[], R>(fn: (...args: T) => Promise<R>, successMessage?: string) => {
      return async (...args: T): Promise<R> => {
        try {
          dispatch({ type: 'SET_ERROR', payload: null });
          const result = await fn(...args);
          if (successMessage) {
            showSuccess('Success', successMessage);
          }
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred';
          dispatch({ type: 'SET_ERROR', payload: errorMessage });
          showError('Error', errorMessage);
          throw error;
        }
      };
    },
    [showSuccess, showError],
  );

  // Album operations
  const loadAlbums = useCallback(
    withErrorHandling(async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const albums = await albumService.getAllAlbums();
      dispatch({ type: 'SET_ALBUMS', payload: albums });
      dispatch({ type: 'SET_LOADING', payload: false });
    }),
    [withErrorHandling],
  );

  const loadAlbum = useCallback(
    withErrorHandling(async (id: AlbumId) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const album = await albumService.getAlbumWithPhotos(id);
      dispatch({ type: 'SET_CURRENT_ALBUM', payload: album });
      dispatch({ type: 'SET_LOADING', payload: false });
    }),
    [withErrorHandling],
  );

  const createAlbum = useCallback(
    withErrorHandling(async (request: CreateAlbumRequest) => {
      dispatch({ type: 'SET_CREATING', payload: true });
      const album = await albumService.createAlbum(request);
      dispatch({ type: 'ADD_ALBUM', payload: album });
      dispatch({ type: 'SET_CREATING', payload: false });
      return album;
    }, 'Album created successfully'),
    [withErrorHandling],
  );

  const updateAlbum = useCallback(
    withErrorHandling(async (id: AlbumId, request: UpdateAlbumRequest) => {
      dispatch({ type: 'SET_UPDATING', payload: true });
      const album = await albumService.updateAlbum(id, request);
      dispatch({ type: 'UPDATE_ALBUM', payload: album });
      dispatch({ type: 'SET_UPDATING', payload: false });
    }, 'Album updated successfully'),
    [withErrorHandling],
  );

  const deleteAlbum = useCallback(
    withErrorHandling(async (id: AlbumId) => {
      dispatch({ type: 'SET_DELETING', payload: true });
      await albumService.deleteAlbum(id);
      dispatch({ type: 'REMOVE_ALBUM', payload: id });
      dispatch({ type: 'SET_DELETING', payload: false });
    }, 'Album deleted successfully'),
    [withErrorHandling],
  );

  // Photo operations
  const addPhotoToAlbum = useCallback(
    withErrorHandling(async (albumId: AlbumId, photoId: PhotoId) => {
      await albumService.addPhotoToAlbum(albumId, photoId);
      if (state.currentAlbum?.id === albumId) {
        dispatch({ type: 'ADD_PHOTO_TO_CURRENT_ALBUM', payload: photoId });
      }
      // Atualizar contador do álbum na lista
      const album = state.albums.find(a => a.id === albumId);
      if (album) {
        dispatch({
          type: 'UPDATE_ALBUM',
          payload: { ...album, photoCount: album.photoCount + 1 },
        });
      }
    }, 'Photo added to album'),
    [withErrorHandling, state.currentAlbum, state.albums],
  );

  const removePhotoFromAlbum = useCallback(
    withErrorHandling(async (albumId: AlbumId, photoId: PhotoId) => {
      await albumService.removePhotoFromAlbum(albumId, photoId);
      if (state.currentAlbum?.id === albumId) {
        dispatch({ type: 'REMOVE_PHOTO_FROM_CURRENT_ALBUM', payload: photoId });
      }
      // Atualizar contador do álbum na lista
      const album = state.albums.find(a => a.id === albumId);
      if (album) {
        dispatch({
          type: 'UPDATE_ALBUM',
          payload: { ...album, photoCount: Math.max(0, album.photoCount - 1) },
        });
      }
    }, 'Photo removed from album'),
    [withErrorHandling, state.currentAlbum, state.albums],
  );

  const movePhotoBetweenAlbums = useCallback(
    withErrorHandling(async (operation: PhotoMoveOperation) => {
      await albumService.movePhotoBetweenAlbums(operation);

      // Atualizar álbum atual se necessário
      if (state.currentAlbum?.id === operation.fromAlbumId) {
        dispatch({ type: 'REMOVE_PHOTO_FROM_CURRENT_ALBUM', payload: operation.photoId });
      }
      if (state.currentAlbum?.id === operation.toAlbumId) {
        dispatch({ type: 'ADD_PHOTO_TO_CURRENT_ALBUM', payload: operation.photoId });
      }

      // Atualizar contadores
      const fromAlbum = state.albums.find(a => a.id === operation.fromAlbumId);
      const toAlbum = state.albums.find(a => a.id === operation.toAlbumId);

      if (fromAlbum) {
        dispatch({
          type: 'UPDATE_ALBUM',
          payload: { ...fromAlbum, photoCount: Math.max(0, fromAlbum.photoCount - 1) },
        });
      }
      if (toAlbum) {
        dispatch({
          type: 'UPDATE_ALBUM',
          payload: { ...toAlbum, photoCount: toAlbum.photoCount + 1 },
        });
      }
    }, 'Photo moved successfully'),
    [withErrorHandling, state.currentAlbum, state.albums],
  );

  // Utility functions
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const getAlbumById = useCallback(
    (id: AlbumId): Album | undefined => {
      return state.albums.find(album => album.id === id);
    },
    [state.albums],
  );

  // Load albums on mount
  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  const contextValue: AlbumContextType = {
    ...state,
    loadAlbums,
    loadAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addPhotoToAlbum,
    removePhotoFromAlbum,
    movePhotoBetweenAlbums,
    clearError,
    getAlbumById,
  };

  return <AlbumContext.Provider value={contextValue}>{children}</AlbumContext.Provider>;
}

// Custom hook (Hook Pattern)
export function useAlbum(): AlbumContextType {
  const context = useContext(AlbumContext);
  if (!context) {
    throw new Error('useAlbum must be used within an AlbumProvider');
  }
  return context;
}
