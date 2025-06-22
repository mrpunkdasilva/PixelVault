/**
 * EmptyState Component
 * Estado vazio reutilizável com diferentes variações
 * Strategy pattern para diferentes tipos de empty states
 */

import React from 'react';
import './styles.scss';

interface EmptyStateProps {
  type: 'albums' | 'photos' | 'search' | 'generic';
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

// Icons para diferentes tipos
const getDefaultIcon = (type: string) => {
  const iconProps = {
    width: 64,
    height: 64,
    fill: 'currentColor',
    className: 'empty-state__icon'
  };

  switch (type) {
    case 'albums':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
        </svg>
      );
    
    case 'photos':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      );
    
    case 'search':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      );
    
    default:
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      );
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  icon
}) => {
  const displayIcon = icon || getDefaultIcon(type);

  return (
    <div className={`empty-state empty-state--${type} ${className}`}>
      <div className="empty-state__content">
        {displayIcon}
        
        <h3 className="empty-state__title">
          {title}
        </h3>
        
        {description && (
          <p className="empty-state__description">
            {description}
          </p>
        )}
        
        {actionLabel && onAction && (
          <button
            className="empty-state__action"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};