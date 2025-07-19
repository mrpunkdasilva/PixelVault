/**
 * Album Form Hook
 * Custom hook para gerenciar formulários de álbuns
 * Strategy pattern para diferentes tipos de operações (create/edit)
 */

import { useState, useCallback, useEffect } from 'react';
import { useAlbum } from '../contexts/AlbumContext';
import type { Album, CreateAlbumRequest, UpdateAlbumRequest } from '../types';

// Form data interface
interface AlbumFormData {
  name: string;
  description: string;
  tags: string[];
  coverPhotoId?: string;
}

// Validation interface
interface FormValidation {
  isValid: boolean;
  errors: {
    name?: string;
    description?: string;
    tags?: string;
  };
}

// Form state interface
interface FormState {
  data: AlbumFormData;
  validation: FormValidation;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Hook options
interface UseAlbumFormOptions {
  mode: 'create' | 'edit';
  initialAlbum?: Album;
  onSuccess?: (album: Album) => void;
  onCancel?: () => void;
}

// Hook return type
interface AlbumFormHandlers {
  formState: FormState;
  updateField: (field: keyof AlbumFormData, value: any) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  validateForm: () => boolean;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  canSubmit: boolean;
}

// Validation strategy
const validateFormData = (data: AlbumFormData): FormValidation => {
  const errors: FormValidation['errors'] = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'Album name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Album name is too long (max 100 characters)';
  } else if (data.name.length < 2) {
    errors.name = 'Album name is too short (min 2 characters)';
  }

  // Description validation
  if (data.description && data.description.length > 500) {
    errors.description = 'Description is too long (max 500 characters)';
  }

  // Tags validation
  if (data.tags.length > 20) {
    errors.tags = 'Too many tags (max 20)';
  }

  const hasErrors = Object.keys(errors).length > 0;

  return {
    isValid: !hasErrors,
    errors,
  };
};

// Initial form data
const getInitialFormData = (album?: Album): AlbumFormData => ({
  name: album?.name || '',
  description: album?.description || '',
  tags: album?.tags || [],
  coverPhotoId: album?.coverPhotoId,
});

export function useAlbumForm(options: UseAlbumFormOptions): AlbumFormHandlers {
  const { createAlbum, updateAlbum } = useAlbum();
  const { mode, initialAlbum, onSuccess } = options;

  // Form state
  const [formState, setFormState] = useState<FormState>(() => {
    const initialData = getInitialFormData(initialAlbum);
    return {
      data: initialData,
      validation: validateFormData(initialData),
      isSubmitting: false,
      isDirty: false,
    };
  });

  // Update field handler
  const updateField = useCallback((field: keyof AlbumFormData, value: any) => {
    setFormState(prev => {
      const newData = { ...prev.data, [field]: value };
      const newValidation = validateFormData(newData);

      return {
        ...prev,
        data: newData,
        validation: newValidation,
        isDirty: true,
      };
    });
  }, []);

  // Tag management
  const addTag = useCallback((tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (!normalizedTag) return;

    setFormState(prev => {
      if (prev.data.tags.includes(normalizedTag)) {
        return prev; // Tag já existe
      }

      const newTags = [...prev.data.tags, normalizedTag];
      const newData = { ...prev.data, tags: newTags };
      const newValidation = validateFormData(newData);

      return {
        ...prev,
        data: newData,
        validation: newValidation,
        isDirty: true,
      };
    });
  }, []);

  const removeTag = useCallback((tag: string) => {
    setFormState(prev => {
      const newTags = prev.data.tags.filter(t => t !== tag);
      const newData = { ...prev.data, tags: newTags };
      const newValidation = validateFormData(newData);

      return {
        ...prev,
        data: newData,
        validation: newValidation,
        isDirty: true,
      };
    });
  }, []);

  // Validation
  const validateForm = useCallback((): boolean => {
    const validation = validateFormData(formState.data);
    setFormState(prev => ({
      ...prev,
      validation,
    }));
    return validation.isValid;
  }, [formState.data]);

  // Form submission
  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      let result: Album;

      if (mode === 'create') {
        const request: CreateAlbumRequest = {
          name: formState.data.name.trim(),
          description: formState.data.description.trim() || undefined,
          tags: formState.data.tags,
          coverPhotoId: formState.data.coverPhotoId,
        };
        result = await createAlbum(request);
      } else {
        if (!initialAlbum) {
          throw new Error('Initial album is required for edit mode');
        }

        const request: UpdateAlbumRequest = {
          name: formState.data.name.trim(),
          description: formState.data.description.trim() || undefined,
          tags: formState.data.tags,
          coverPhotoId: formState.data.coverPhotoId,
        };
        await updateAlbum(initialAlbum.id, request);
        result = { ...initialAlbum, ...request, updatedAt: new Date() };
      }

      // Reset form state
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        isDirty: false,
      }));

      // Call success callback
      onSuccess?.(result);
    } catch (error) {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
      throw error; // Re-throw para ser tratado pelo contexto
    }
  }, [formState.data, mode, initialAlbum, createAlbum, updateAlbum, validateForm, onSuccess]);

  // Form reset
  const resetForm = useCallback(() => {
    const initialData = getInitialFormData(initialAlbum);
    setFormState({
      data: initialData,
      validation: validateFormData(initialData),
      isSubmitting: false,
      isDirty: false,
    });
  }, [initialAlbum]);

  // Update form when initial album changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && initialAlbum) {
      const newData = getInitialFormData(initialAlbum);
      setFormState(prev => ({
        ...prev,
        data: newData,
        validation: validateFormData(newData),
        isDirty: false,
      }));
    }
  }, [mode, initialAlbum]);

  // Computed properties
  const canSubmit = formState.validation.isValid && formState.isDirty && !formState.isSubmitting;

  return {
    formState,
    updateField,
    addTag,
    removeTag,
    validateForm,
    submitForm,
    resetForm,
    canSubmit,
  };
}
