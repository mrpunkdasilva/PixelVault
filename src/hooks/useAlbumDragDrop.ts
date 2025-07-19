/**
 * Album Drag & Drop Hook
 * Strategy pattern implementation para diferentes estratégias de drag and drop
 * Single Responsibility: gerenciar operações de arrastar e soltar entre álbuns
 */

import { useCallback, useState } from 'react';
import { useAlbum } from '../contexts/AlbumContext';
import { useNotificationHelpers } from '../contexts/NotificationContext';
import type { AlbumId, PhotoId, PhotoMoveOperation } from '../types';

// Interfaces para diferentes estratégias de drag and drop
interface DragData {
  type: 'photo' | 'album';
  id: string;
  source?: AlbumId;
}

interface DropResult {
  success: boolean;
  operation?: PhotoMoveOperation;
  error?: string;
}

interface DragDropHandlers {
  onDragStart: (e: React.DragEvent, data: DragData) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetAlbumId: AlbumId) => Promise<DropResult>;
  isDragging: boolean;
  dragOverTarget: AlbumId | null;
}

// Hook principal
export function useAlbumDragDrop(): DragDropHandlers {
  const { movePhotoBetweenAlbums } = useAlbum();
  const { showError } = useNotificationHelpers();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOverTarget, setDragOverTarget] = useState<AlbumId | null>(null);
  const [dragData, setDragData] = useState<DragData | null>(null);

  // Strategy: Handle drag start
  const onDragStart = useCallback((e: React.DragEvent, data: DragData) => {
    setIsDragging(true);
    setDragData(data);

    // Configurar dados do drag
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';

    // Visual feedback
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '0.5';
    }
  }, []);

  // Strategy: Handle drag over (necessário para permitir drop)
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Strategy: Handle drag enter
  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    // Identificar o target album
    const albumElement = e.currentTarget.closest('[data-album-id]');
    if (albumElement instanceof HTMLElement) {
      const albumId = albumElement.dataset.albumId;
      if (albumId) {
        setDragOverTarget(albumId);
      }
    }
  }, []);

  // Strategy: Handle drag leave
  const onDragLeave = useCallback((e: React.DragEvent) => {
    // Só limpar se realmente saiu do elemento
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverTarget(null);
    }
  }, []);

  // Strategy: Handle drop
  const onDrop = useCallback(
    async (e: React.DragEvent, targetAlbumId: AlbumId): Promise<DropResult> => {
      e.preventDefault();
      setIsDragging(false);
      setDragOverTarget(null);

      try {
        // Recuperar dados do drag
        const dataJson = e.dataTransfer.getData('application/json');
        const data: DragData = dataJson ? JSON.parse(dataJson) : dragData;

        if (!data) {
          return { success: false, error: 'No drag data available' };
        }

        // Validações
        if (data.type !== 'photo') {
          return { success: false, error: 'Only photos can be moved between albums' };
        }

        if (!data.source) {
          return { success: false, error: 'Source album not specified' };
        }

        if (data.source === targetAlbumId) {
          return { success: false, error: 'Photo is already in this album' };
        }

        // Executar operação de mover foto
        const operation: PhotoMoveOperation = {
          photoId: data.id as PhotoId,
          fromAlbumId: data.source,
          toAlbumId: targetAlbumId,
        };

        await movePhotoBetweenAlbums(operation);

        return { success: true, operation };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to move photo';
        showError('Error', errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        // Cleanup visual effects
        setDragData(null);
        const draggedElements = document.querySelectorAll('[style*="opacity: 0.5"]');
        draggedElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.opacity = '';
          }
        });
      }
    },
    [dragData, movePhotoBetweenAlbums, showError],
  );

  return {
    onDragStart,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrop,
    isDragging,
    dragOverTarget,
  };
}

// Hook especializado para photos
export function usePhotoDragDrop(photoId: PhotoId, albumId?: AlbumId) {
  const dragDropHandlers = useAlbumDragDrop();

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      const dragData: DragData = {
        type: 'photo',
        id: photoId,
        source: albumId,
      };
      dragDropHandlers.onDragStart(e, dragData);
    },
    [dragDropHandlers, photoId, albumId],
  );

  return {
    ...dragDropHandlers,
    onDragStart: handleDragStart,
  };
}

// Hook especializado para album drop zones
export function useAlbumDropZone(albumId: AlbumId) {
  const dragDropHandlers = useAlbumDragDrop();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      return dragDropHandlers.onDrop(e, albumId);
    },
    [dragDropHandlers, albumId],
  );

  const isDropTarget = dragDropHandlers.dragOverTarget === albumId;

  return {
    onDragOver: dragDropHandlers.onDragOver,
    onDragEnter: dragDropHandlers.onDragEnter,
    onDragLeave: dragDropHandlers.onDragLeave,
    onDrop: handleDrop,
    isDropTarget,
    isDragging: dragDropHandlers.isDragging,
  };
}
