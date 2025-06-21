import React, { useState } from 'react';
import { KeyboardShortcut, formatShortcut } from '../../hooks/useKeyboardShortcuts';
import './KeyboardShortcutsHelp.scss';

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  shortcuts,
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  onClose: externalOnClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const toggleHelp = () => {
    if (externalOnToggle) {
      externalOnToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const closeHelp = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      <button
        className='keyboard-shortcuts-trigger'
        onClick={toggleHelp}
        title='Keyboard Shortcuts (Press Ctrl+H to toggle)'
      >
        <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
          <path
            d='M9.879 7.519c.1-.2.209-.34.319-.42.11-.08.239-.12.369-.12.12 0 .239.04.339.12.1.08.18.2.239.32L13.519 12l-2.374 4.58c-.06.12-.14.24-.239.32-.1.08-.219.12-.339.12-.13 0-.259-.04-.369-.12-.11-.08-.219-.22-.319-.42L7.505 12l2.374-4.48z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M14.121 16.481c-.1.2-.209.34-.319.42-.11.08-.239.12-.369.12-.12 0-.239-.04-.339-.12-.1-.08-.18-.2-.239-.32L10.481 12l2.374-4.58c.06-.12.14-.24.239-.32.1-.08.219-.12.339-.12.13 0 .259.04.369.12.11.08.219.22.319.42L16.495 12l-2.374 4.48z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='keyboard-shortcuts-overlay' onClick={closeHelp}>
          <div className='keyboard-shortcuts-modal' onClick={e => e.stopPropagation()}>
            <div className='keyboard-shortcuts-header'>
              <h2>Keyboard Shortcuts</h2>
              <button
                className='keyboard-shortcuts-close'
                onClick={closeHelp}
                aria-label='Close shortcuts help'
              >
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M6 18L18 6M6 6l12 12'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>

            <div className='keyboard-shortcuts-content'>
              <div className='keyboard-shortcuts-list'>
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className='keyboard-shortcut-item'>
                    <div className='keyboard-shortcut-keys'>
                      {formatShortcut(shortcut)
                        .split(' + ')
                        .map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className='keyboard-key'>{key}</kbd>
                            {keyIndex < formatShortcut(shortcut).split(' + ').length - 1 && (
                              <span className='keyboard-plus'>+</span>
                            )}
                          </React.Fragment>
                        ))}
                    </div>
                    <div className='keyboard-shortcut-description'>{shortcut.description}</div>
                  </div>
                ))}
              </div>

              <div className='keyboard-shortcuts-footer'>
                <p>
                  Press <kbd className='keyboard-key'>Esc</kbd> to close this dialog
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Export types and default export for lazy loading
export type { KeyboardShortcutsHelpProps };
export default KeyboardShortcutsHelp;
