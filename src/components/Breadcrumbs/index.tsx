/**
 * Breadcrumbs Component
 * Navegação hierárquica com design pixel art
 * Suporta click navigation e keyboard shortcuts
 */

import React from 'react';
import type { NavigationView } from '../../hooks/useNavigation';
import './styles.scss';

interface BreadcrumbItem {
  label: string;
  view: NavigationView;
  albumId?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (view: NavigationView, albumId?: string) => void;
  canGoBack?: boolean;
  onGoBack?: () => void;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate,
  canGoBack = false,
  onGoBack,
  className = '',
}) => {
  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    // Don't navigate if it's the current (last) item
    if (index !== items.length - 1) {
      onNavigate(item.view, item.albumId);
    }
  };

  const handleBackClick = () => {
    if (canGoBack && onGoBack) {
      onGoBack();
    }
  };

  return (
    <div className={`breadcrumbs ${className}`}>
      {/* Back Button */}
      {canGoBack && onGoBack && (
        <button
          className='breadcrumbs__back'
          onClick={handleBackClick}
          title='Go back (Alt + ←)'
          aria-label='Go back'
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' />
          </svg>
        </button>
      )}

      {/* Breadcrumb Items */}
      <div className='breadcrumbs__items'>
        {items.map((item, index) => (
          <React.Fragment key={`${item.view}-${item.albumId || 'root'}`}>
            {index > 0 && (
              <span className='breadcrumbs__separator' aria-hidden='true'>
                <svg width='12' height='12' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' />
                </svg>
              </span>
            )}

            <button
              className={`breadcrumbs__item ${
                index === items.length - 1 ? 'breadcrumbs__item--current' : ''
              }`}
              onClick={() => handleItemClick(item, index)}
              disabled={index === items.length - 1}
              title={item.label}
            >
              {/* Icon for different views */}
              <span className='breadcrumbs__icon'>
                {item.view === 'photos' && (
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
                  </svg>
                )}
                {item.view === 'albums' && (
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z' />
                  </svg>
                )}
                {item.view === 'album-detail' && (
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z' />
                  </svg>
                )}
              </span>

              <span className='breadcrumbs__text'>{item.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className='breadcrumbs__shortcuts'>
        <span className='breadcrumbs__shortcut-hint'>
          <kbd>Ctrl</kbd> + <kbd>1</kbd> Photos
        </span>
        <span className='breadcrumbs__shortcut-hint'>
          <kbd>Ctrl</kbd> + <kbd>2</kbd> Albums
        </span>
        {canGoBack && (
          <span className='breadcrumbs__shortcut-hint'>
            <kbd>Alt</kbd> + <kbd>←</kbd> Back
          </span>
        )}
      </div>
    </div>
  );
};
