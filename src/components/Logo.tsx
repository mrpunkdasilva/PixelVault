import React from 'react';
import styled from 'styled-components';

const AnimatedSvg = styled.svg`
  .lock-mechanism {
    animation: rotate 4s linear infinite;
    transform-origin: 50px 50px;
  }
  
  .pixel-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .pixel-float:nth-child(2) {
    animation-delay: -0.5s;
  }
  
  .pixel-float:nth-child(3) {
    animation-delay: -1s;
  }
  
  .pixel-float:nth-child(4) {
    animation-delay: -1.5s;
  }
  
  .vault-glow {
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
    50% { transform: translateY(-3px) scale(1.1); opacity: 1; }
  }
  
  @keyframes glow {
    0% { filter: drop-shadow(0 0 2px #756df4); }
    100% { filter: drop-shadow(0 0 8px #756df4); }
  }
`;

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 60, className }) => {
  return (
    <AnimatedSvg
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
      
      {/* Vault/Safe body - maior */}
      <rect 
        x="15" 
        y="15" 
        width="70" 
        height="70" 
        rx="6" 
        fill="url(#vaultGradient)" 
        stroke="#756df4" 
        strokeWidth="2"
        className="vault-glow"
      />
      
      {/* Vault door - maior */}
      <rect 
        x="22" 
        y="22" 
        width="56" 
        height="56" 
        rx="4" 
        fill="url(#doorGradient)" 
        stroke="#756df4" 
        strokeWidth="1.5"
      />
      
      {/* Lock mechanism - outer ring */}
      <circle 
        cx="50" 
        cy="50" 
        r="12" 
        fill="none" 
        stroke="#756df4" 
        strokeWidth="2.5"
        className="lock-mechanism"
      />
      
      {/* Lock mechanism - middle ring */}
      <circle 
        cx="50" 
        cy="50" 
        r="8" 
        fill="none" 
        stroke="#756df4" 
        strokeWidth="1.5" 
        opacity="0.7"
        className="lock-mechanism"
        style={{ animationDirection: 'reverse', animationDuration: '6s' }}
      />
      
      {/* Lock mechanism - inner circle */}
      <circle cx="50" cy="50" r="5" fill="#756df4"/>
      
      {/* Lock handle */}
      <rect x="47.5" y="62" width="5" height="8" rx="2" fill="#756df4"/>
      
      {/* Animated pixel effects - scattered around */}
      <rect 
        x="8" 
        y="25" 
        width="4" 
        height="4" 
        fill="#756df4" 
        className="pixel-float"
      />
      <rect 
        x="88" 
        y="30" 
        width="4" 
        height="4" 
        fill="#756df4" 
        className="pixel-float"
      />
      <rect 
        x="12" 
        y="70" 
        width="4" 
        height="4" 
        fill="#756df4" 
        className="pixel-float"
      />
      <rect 
        x="84" 
        y="65" 
        width="4" 
        height="4" 
        fill="#756df4" 
        className="pixel-float"
      />
      
      {/* Additional smaller pixels */}
      <rect 
        x="92" 
        y="50" 
        width="3" 
        height="3" 
        fill="#756df4" 
        opacity="0.8"
        className="pixel-float"
      />
      <rect 
        x="5" 
        y="45" 
        width="3" 
        height="3" 
        fill="#756df4" 
        opacity="0.8"
        className="pixel-float"
      />
      <rect 
        x="25" 
        y="5" 
        width="3" 
        height="3" 
        fill="#756df4" 
        opacity="0.6"
        className="pixel-float"
      />
      <rect 
        x="70" 
        y="92" 
        width="3" 
        height="3" 
        fill="#756df4" 
        opacity="0.6"
        className="pixel-float"
      />
    </AnimatedSvg>
  );
};