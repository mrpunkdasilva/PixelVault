/**
 * LoadingSkeletons Component
 * Skeleton screens para melhor UX durante carregamento
 * Factory pattern para diferentes tipos de skeletons
 */

import React from 'react';
import './styles.scss';

interface LoadingSkeletonsProps {
  type: 'albums' | 'photos' | 'album-form' | 'sidebar';
  count?: number;
  className?: string;
}

// Album skeleton card
const AlbumSkeleton: React.FC = () => (
  <div className='skeleton skeleton--album'>
    <div className='skeleton__cover'></div>
    <div className='skeleton__content'>
      <div className='skeleton__title'></div>
      <div className='skeleton__subtitle'></div>
      <div className='skeleton__tags'>
        <div className='skeleton__tag'></div>
        <div className='skeleton__tag'></div>
      </div>
      <div className='skeleton__meta'></div>
    </div>
  </div>
);

// Photo skeleton card
const PhotoSkeleton: React.FC = () => (
  <div className='skeleton skeleton--photo'>
    <div className='skeleton__image'></div>
  </div>
);

// Album form skeleton
const AlbumFormSkeleton: React.FC = () => (
  <div className='skeleton skeleton--form'>
    <div className='skeleton__form-header'>
      <div className='skeleton__title'></div>
    </div>
    <div className='skeleton__form-body'>
      <div className='skeleton__field'>
        <div className='skeleton__label'></div>
        <div className='skeleton__input'></div>
      </div>
      <div className='skeleton__field'>
        <div className='skeleton__label'></div>
        <div className='skeleton__textarea'></div>
      </div>
      <div className='skeleton__field'>
        <div className='skeleton__label'></div>
        <div className='skeleton__tags'>
          <div className='skeleton__tag'></div>
          <div className='skeleton__tag'></div>
          <div className='skeleton__tag'></div>
        </div>
      </div>
    </div>
    <div className='skeleton__form-actions'>
      <div className='skeleton__button'></div>
      <div className='skeleton__button'></div>
    </div>
  </div>
);

// Sidebar skeleton
const SidebarSkeleton: React.FC = () => (
  <div className='skeleton skeleton--sidebar'>
    <div className='skeleton__sidebar-header'>
      <div className='skeleton__title'></div>
      <div className='skeleton__button'></div>
    </div>
    <div className='skeleton__sidebar-content'>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className='skeleton__sidebar-item'>
          <div className='skeleton__sidebar-icon'></div>
          <div className='skeleton__sidebar-text'></div>
          <div className='skeleton__sidebar-count'></div>
        </div>
      ))}
    </div>
  </div>
);

// Factory function para criar skeletons
const createSkeletons = (type: string, count: number) => {
  const skeletonMap = {
    albums: AlbumSkeleton,
    photos: PhotoSkeleton,
    'album-form': AlbumFormSkeleton,
    sidebar: SidebarSkeleton,
  };

  const SkeletonComponent = skeletonMap[type as keyof typeof skeletonMap];

  if (!SkeletonComponent) {
    console.warn(`Unknown skeleton type: ${type}`);
    return null;
  }

  return Array.from({ length: count }, (_, index) => <SkeletonComponent key={index} />);
};

export const LoadingSkeletons: React.FC<LoadingSkeletonsProps> = ({
  type,
  count = 1,
  className = '',
}) => {
  const skeletons = createSkeletons(type, count);

  if (!skeletons) {
    return null;
  }

  return (
    <div className={`loading-skeletons loading-skeletons--${type} ${className}`}>{skeletons}</div>
  );
};
