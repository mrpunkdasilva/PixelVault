import React from 'react';
import './styles.scss';
import { Logo } from '../Logo';

interface LogoWithTextProps {
  size?: number;
  showSubtext?: boolean;
  className?: string;
}

export const LogoWithText: React.FC<LogoWithTextProps> = ({
  size = 50,
  showSubtext = false,
  className,
}) => {
  return (
    <header className={`logo-container ${className || ''}`}>
      <Logo size={size} />
      <hgroup className='brand-content'>
        <h1 className='brand-text'>PixelVault</h1>
        {showSubtext && <p className='sub-text'>Secure Photo Storage</p>}
      </hgroup>
    </header>
  );
};
