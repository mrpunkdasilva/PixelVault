/**
 * AlbumForm Component
 * Formulário para criar e editar álbuns
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNotificationHelpers } from '../../contexts/NotificationContext';
import { useAlbum } from '../../contexts/AlbumContext';
import type { Album } from '../../types';
import './styles.scss';

interface AlbumFormProps {
  mode: 'create' | 'edit';
  album?: Album;
  onSuccess: (album: Album) => void;
  onCancel: () => void;
  className?: string;
}

export const AlbumForm: React.FC<AlbumFormProps> = ({
  mode,
  album,
  onSuccess,
  onCancel,
  className = ''
}) => {
  const { showError } = useNotificationHelpers();
  const { createAlbum, updateAlbum, ui } = useAlbum();
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: album?.name || '',
    description: album?.description || '',
    tags: album?.tags || [],
    isDefault: album?.isDefault || false
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Use context loading states
  const isSubmitting = mode === 'create' ? ui.isCreating : ui.isUpdating;

  // Focus name input on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Album name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Album name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Album name must be less than 50 characters';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    if (formData.tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle tag input
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = currentTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const albumData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        tags: formData.tags
      };

      if (mode === 'create') {
        // Create new album using context
        const newAlbum = await createAlbum(albumData);
        onSuccess(newAlbum);
      } else {
        // Update existing album using context
        if (!album?.id) {
          throw new Error('No album ID provided for update');
        }
        await updateAlbum(album.id, albumData);
        const updatedAlbum: Album = {
          ...album,
          ...albumData,
          updatedAt: new Date()
        };
        onSuccess(updatedAlbum);
      }
    } catch (error) {
      console.error('Error saving album:', error);
      showError('Save Failed', 'Failed to save album. Please try again.');
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        handleSubmit(e as any);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onCancel]);

  return (
    <div className={`album-form ${className}`}>
      <div className="album-form__header">
        <h2>{mode === 'create' ? 'Create New Album' : 'Edit Album'}</h2>
        <button 
          className="album-form__close"
          onClick={onCancel}
          type="button"
          aria-label="Close form"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="album-form__form">
        {/* Album Name */}
        <div className="form-group">
          <label htmlFor="album-name" className="form-label">
            Album Name *
          </label>
          <input
            ref={nameInputRef}
            id="album-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
            placeholder="Enter album name..."
            maxLength={50}
            disabled={isSubmitting}
          />
          {errors.name && (
            <span className="form-error">{errors.name}</span>
          )}
          <div className="form-hint">
            {formData.name.length}/50 characters
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="album-description" className="form-label">
            Description
          </label>
          <textarea
            id="album-description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
            placeholder="Describe this album... (optional)"
            rows={3}
            maxLength={200}
            disabled={isSubmitting}
          />
          {errors.description && (
            <span className="form-error">{errors.description}</span>
          )}
          <div className="form-hint">
            {formData.description.length}/200 characters
          </div>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="album-tags" className="form-label">
            Tags
          </label>
          <div className="tags-input">
            <input
              id="album-tags"
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              onBlur={addTag}
              className="form-input"
              placeholder="Add tags... (press Enter or comma to add)"
              disabled={isSubmitting || formData.tags.length >= 10}
            />
            <button
              type="button"
              onClick={addTag}
              className="add-tag-btn"
              disabled={!currentTag.trim() || formData.tags.length >= 10}
            >
              Add
            </button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="tags-list">
              {formData.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="tag-remove"
                    disabled={isSubmitting}
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {errors.tags && (
            <span className="form-error">{errors.tags}</span>
          )}
          <div className="form-hint">
            {formData.tags.length}/10 tags
          </div>
        </div>

        {/* Form Actions */}
        <div className="album-form__actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn--secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isSubmitting || !formData.name.trim()}
          >
            {isSubmitting ? (
              <>
                <svg className="btn-spinner" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
                </svg>
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              mode === 'create' ? 'Create Album' : 'Update Album'
            )}
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="album-form__shortcuts">
          <small>
            Press <kbd>Escape</kbd> to cancel or <kbd>Ctrl+Enter</kbd> to save
          </small>
        </div>
      </form>
    </div>
  );
};