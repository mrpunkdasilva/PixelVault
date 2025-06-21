import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: (event?: KeyboardEvent) => void;
  description: string;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle shortcuts if user is typing in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Debug log for all key presses (uncomment for debugging)
    // console.log('Key pressed:', {
    //   key: event.key,
    //   code: event.code,
    //   ctrlKey: event.ctrlKey,
    //   altKey: event.altKey,
    //   shiftKey: event.shiftKey,
    //   metaKey: event.metaKey
    // });

    const matchingShortcut = shortcuts.find(shortcut => {
      // Check key match
      let keyMatches = false;
      
      // Handle special case for ? (which is Shift+/)
      if (shortcut.key === '?' && event.key === '?' && event.shiftKey) {
        keyMatches = true;
      } else if (shortcut.key === '?' && event.key === '/' && event.shiftKey) {
        // Fallback for browsers that might report '/' instead of '?'
        keyMatches = true;
      } else if (shortcut.key.toLowerCase() === event.key.toLowerCase()) {
        keyMatches = true;
      }

      // Check modifier keys
      const ctrlMatches = Boolean(shortcut.ctrlKey) === event.ctrlKey;
      const altMatches = Boolean(shortcut.altKey) === event.altKey;
      const shiftMatches = Boolean(shortcut.shiftKey) === event.shiftKey;
      const metaMatches = Boolean(shortcut.metaKey) === event.metaKey;

      return keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches;
    });

    if (matchingShortcut) {
      // console.log('Keyboard shortcut triggered:', matchingShortcut.description); // Debug log
      if (matchingShortcut.preventDefault !== false) {
        event.preventDefault();
        event.stopPropagation();
      }
      matchingShortcut.action(event);
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.metaKey) parts.push('Cmd');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(' + ');
};