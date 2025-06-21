import React from 'react';

interface LogoIconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ 
  size = 40, 
  className, 
  color = "#756df4" 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="vaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3d3f43" />
          <stop offset="100%" stopColor="#28272f" />
        </linearGradient>
        <linearGradient id="doorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2f" />
          <stop offset="100%" stopColor="#1a1a1f" />
        </linearGradient>
      </defs>
      
      {/* Vault/Safe body */}
      <rect x="15" y="15" width="70" height="70" rx="6" fill="url(#vaultGradient)" stroke={color} strokeWidth="2"/>
      
      {/* Vault door */}
      <rect x="22" y="22" width="56" height="56" rx="4" fill="url(#doorGradient)" stroke={color} strokeWidth="1.5"/>
      
      {/* Lock mechanism - outer ring */}
      <circle cx="50" cy="50" r="12" fill="none" stroke={color} strokeWidth="2.5"/>
      
      {/* Lock mechanism - inner circle */}
      <circle cx="50" cy="50" r="5" fill={color}/>
      
      {/* Lock handle */}
      <rect x="47.5" y="62" width="5" height="8" rx="2" fill={color}/>
    </svg>
  );
};