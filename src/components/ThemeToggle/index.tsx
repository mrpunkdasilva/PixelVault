import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './styles.scss';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className='theme-toggle'
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className='theme-toggle-inner'>
        {theme === 'light' ? (
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
              d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        ) : (
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <circle cx='12' cy='12' r='5' stroke='currentColor' strokeWidth='2' />
            <path
              d='m12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        )}
      </div>
    </button>
  );
};
