/**
 * AlbumCarousel3D Component
 * Carrossel 3D animado para exibição de álbuns com efeitos visuais
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAlbum } from '../../contexts/AlbumContext';
import { LoadingSkeletons } from '../LoadingSkeletons';
import { useNotificationHelpers } from '../../contexts/NotificationContext';
import type { Album } from '../../types';
import './styles.scss';

interface AlbumCarousel3DProps {
  onAlbumClick?: (albumId: string) => void;
  onCreateAlbum?: () => void;
  className?: string;
}

export const AlbumCarousel3D: React.FC<AlbumCarousel3DProps> = ({
  onAlbumClick,
  onCreateAlbum,
  className = ''
}) => {
  const { albums, ui } = useAlbum();
  const { showSuccess, showError } = useNotificationHelpers();
  
  // State for carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'photos'>('date');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs
  const carouselRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort albums
  const filteredAndSortedAlbums = React.useMemo(() => {
    let filtered = albums.filter(album =>
      album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort albums
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case 'photos':
          return b.photoCount - a.photoCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [albums, searchTerm, sortBy]);

  // Handle navigation
  const navigateCarousel = (direction: 'prev' | 'next') => {
    if (isAnimating || filteredAndSortedAlbums.length === 0) return;

    setIsAnimating(true);
    
    if (direction === 'next') {
      setCurrentIndex(prev => (prev + 1) % filteredAndSortedAlbums.length);
    } else {
      setCurrentIndex(prev => 
        prev === 0 ? filteredAndSortedAlbums.length - 1 : prev - 1
      );
    }

    setTimeout(() => setIsAnimating(false), 600);
  };

  // Auto-play functionality
  useEffect(() => {
    if (filteredAndSortedAlbums.length <= 1) return;

    const interval = setInterval(() => {
      navigateCarousel('next');
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredAndSortedAlbums.length, isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target === searchInputRef.current) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          navigateCarousel('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateCarousel('next');
          break;
        case 'Enter':
          if (filteredAndSortedAlbums[currentIndex]) {
            onAlbumClick?.(filteredAndSortedAlbums[currentIndex].id);
          }
          break;
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, filteredAndSortedAlbums, onAlbumClick]);

  // Reset current index when filtered albums change
  useEffect(() => {
    if (currentIndex >= filteredAndSortedAlbums.length) {
      setCurrentIndex(0);
    }
  }, [filteredAndSortedAlbums.length, currentIndex]);

  // Loading state
  if (ui.isLoading) {
    return (
      <div className={`album-carousel-3d ${className}`}>
        <div className="album-carousel-3d__header">
          <h2>My Albums</h2>
          <div className="album-carousel-3d__loading">
            <LoadingSkeletons type="albums" count={1} />
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (albums.length === 0) {
    return (
      <div className={`album-carousel-3d ${className}`}>
        <div className="album-carousel-3d__header">
          <h2>My Albums</h2>
          <div className="album-carousel-3d__controls">
            <button 
              className="create-album-btn"
              onClick={onCreateAlbum}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Create Album
            </button>
          </div>
        </div>
        
        <div className="album-carousel-3d__empty">
          <div className="empty-state-3d">
            <svg viewBox="0 0 24 24" fill="currentColor" className="empty-icon">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
            </svg>
            <h3>No albums yet</h3>
            <p>Create your first album to organize your photos</p>
            <button 
              className="create-first-album-btn"
              onClick={onCreateAlbum}
            >
              Create Your First Album
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No search results
  if (filteredAndSortedAlbums.length === 0) {
    return (
      <div className={`album-carousel-3d ${className}`}>
        <div className="album-carousel-3d__header">
          <h2>My Albums</h2>
          <div className="album-carousel-3d__controls">
            <div className="search-box">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search albums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="photos">Sort by Photos</option>
            </select>
            
            <button 
              className="create-album-btn"
              onClick={onCreateAlbum}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Create Album
            </button>
          </div>
        </div>
        
        <div className="album-carousel-3d__no-results">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <h3>No albums found</h3>
          <p>Try adjusting your search criteria</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="clear-search-btn"
          >
            Clear Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`album-carousel-3d ${className}`}>
      {/* Header with controls */}
      <div className="album-carousel-3d__header">
        <h2>My Albums</h2>
        <div className="album-carousel-3d__controls">
          <div className="search-box">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search albums... (Press / to focus)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="photos">Sort by Photos</option>
          </select>
          
          <button 
            className="create-album-btn"
            onClick={onCreateAlbum}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Create Album
          </button>
        </div>
      </div>

      {/* Carousel container */}
      <div className="album-carousel-3d__container" ref={carouselRef}>
        <div className="album-carousel-3d__viewport">
          <div 
            className="album-carousel-3d__track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isAnimating ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          >
            {filteredAndSortedAlbums.map((album, index) => (
              <AlbumCard3D
                key={album.id}
                album={album}
                isActive={index === currentIndex}
                onClick={() => onAlbumClick?.(album.id)}
              />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        {filteredAndSortedAlbums.length > 1 && (
          <>
            <button
              className="carousel-nav carousel-nav--prev"
              onClick={() => navigateCarousel('prev')}
              disabled={isAnimating}
              aria-label="Previous album"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            
            <button
              className="carousel-nav carousel-nav--next"
              onClick={() => navigateCarousel('next')}
              disabled={isAnimating}
              aria-label="Next album"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </>
        )}

        {/* Indicators */}
        {filteredAndSortedAlbums.length > 1 && (
          <div className="album-carousel-3d__indicators">
            {filteredAndSortedAlbums.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'indicator--active' : ''}`}
                onClick={() => {
                  if (!isAnimating) {
                    setCurrentIndex(index);
                  }
                }}
                aria-label={`Go to album ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Album counter */}
        <div className="album-carousel-3d__counter">
          {currentIndex + 1} of {filteredAndSortedAlbums.length}
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="album-carousel-3d__hints">
        <span>Use ← → arrow keys or click to navigate</span>
        <span>Press / to search • Enter to open album</span>
      </div>
    </div>
  );
};

// Individual album card component for 3D effect
interface AlbumCard3DProps {
  album: Album;
  isActive: boolean;
  onClick: () => void;
}

const AlbumCard3D: React.FC<AlbumCard3DProps> = ({ album, isActive, onClick }) => {
  const renderCoverImage = () => {
    if (album.coverPhotoId) {
      return (
        <img
          src={`/api/photos/${album.coverPhotoId}/thumbnail`}
          alt={`${album.name} cover`}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-album.svg';
          }}
        />
      );
    }

    return (
      <div className="album-card-3d__placeholder">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
        </svg>
      </div>
    );
  };

  return (
    <div 
      className={`album-card-3d ${isActive ? 'album-card-3d--active' : ''}`}
      onClick={onClick}
    >
      <div className="album-card-3d__inner">
        <div className="album-card-3d__front">
          <div className="album-card-3d__cover">
            {renderCoverImage()}
          </div>
          
          <div className="album-card-3d__content">
            <h3 className="album-card-3d__title">{album.name}</h3>
            <p className="album-card-3d__count">
              {album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}
            </p>
            
            {album.description && (
              <p className="album-card-3d__description">
                {album.description}
              </p>
            )}
            
            {album.tags.length > 0 && (
              <div className="album-card-3d__tags">
                {album.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="album-card-3d__tag">
                    {tag}
                  </span>
                ))}
                {album.tags.length > 3 && (
                  <span className="album-card-3d__tag album-card-3d__tag--more">
                    +{album.tags.length - 3}
                  </span>
                )}
              </div>
            )}
            
            <div className="album-card-3d__meta">
              <time>{album.updatedAt.toLocaleDateString()}</time>
              {album.isDefault && (
                <span className="album-card-3d__badge">Default</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="album-card-3d__back">
          <div className="album-card-3d__back-content">
            <h4>Album Details</h4>
            <ul>
              <li>Photos: {album.photoCount}</li>
              <li>Created: {album.createdAt.toLocaleDateString()}</li>
              <li>Updated: {album.updatedAt.toLocaleDateString()}</li>
              {album.tags.length > 0 && (
                <li>Tags: {album.tags.join(', ')}</li>
              )}
            </ul>
            <button className="open-album-btn">
              Open Album
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};