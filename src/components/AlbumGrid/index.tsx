/**
 * AlbumGrid Component
 * Grid responsivo para exibição de álbuns
 * Responsabilidade única: renderização da lista de álbuns
 */

import React from 'react';
import { useAlbum } from '../../contexts/AlbumContext';
import { AlbumCard } from '../AlbumCard';
import { LoadingSkeletons } from '../LoadingSkeletons';
import { EmptyState } from '../EmptyState';
import './styles.scss';

interface AlbumGridProps {
  onAlbumClick?: (albumId: string) => void;
  onCreateAlbum?: () => void;
  className?: string;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  onAlbumClick,
  onCreateAlbum,
  className = '',
}) => {
  const { albums, ui } = useAlbum();

  // Loading state
  if (ui.isLoading) {
    return (
      <div className={`album-grid ${className}`}>
        <LoadingSkeletons type='albums' count={6} />
      </div>
    );
  }

  // Empty state
  if (albums.length === 0) {
    return (
      <EmptyState
        type='albums'
        title='No albums yet'
        description='Create your first album to organize your photos'
        actionLabel='Create Album'
        onAction={onCreateAlbum}
        className={className}
      />
    );
  }

  return (
    <div className={`album-grid ${className}`}>
      {albums.map(album => (
        <AlbumCard key={album.id} album={album} onClick={onAlbumClick} />
      ))}
    </div>
  );
};
