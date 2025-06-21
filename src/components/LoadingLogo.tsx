import React from 'react';
import styled from 'styled-components';

const LoadingAnimatedSvg = styled.svg`
  .vault-body {
    animation: loading-pulse 1.5s ease-in-out infinite;
  }
  
  .lock-mechanism-outer {
    animation: loading-spin 2s linear infinite;
    transform-origin: 50px 50px;
  }
  
  .lock-mechanism-middle {
    animation: loading-spin-reverse 1.5s linear infinite;
    transform-origin: 50px 50px;
  }
  
  .lock-center {
    animation: loading-breathe 1s ease-in-out infinite;
    transform-origin: 50px 50px;
  }
  
  .pixel-loading {
    animation: loading-pixels 2s ease-in-out infinite;
  }
  
  .pixel-loading:nth-child(2) { animation-delay: -0.2s; }
  .pixel-loading:nth-child(3) { animation-delay: -0.4s; }
  .pixel-loading:nth-child(4) { animation-delay: -0.6s; }
  .pixel-loading:nth-child(5) { animation-delay: -0.8s; }
  .pixel-loading:nth-child(6) { animation-delay: -1s; }
  .pixel-loading:nth-child(7) { animation-delay: -1.2s; }
  .pixel-loading:nth-child(8) { animation-delay: -1.4s; }
  
  @keyframes loading-pulse {
    0%, 100% { 
      filter: drop-shadow(0 0 5px #756df4);
      stroke: #756df4;
    }
    50% { 
      filter: drop-shadow(0 0 20px #756df4) drop-shadow(0 0 30px rgba(117, 109, 244, 0.5));
      stroke: #9c88ff;
    }
  }
  
  @keyframes loading-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes loading-spin-reverse {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }
  
  @keyframes loading-breathe {
    0%, 100% { 
      transform: scale(1);
      filter: brightness(1);
    }
    50% { 
      transform: scale(1.2);
      filter: brightness(1.5);
    }
  }
  
  @keyframes loading-pixels {
    0%, 100% { 
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% { 
      opacity: 1;
      transform: scale(1.3);
      filter: brightness(1.8);
    }
  }
`;

interface LoadingLogoProps {
  size?: number;
  className?: string;
}

export const LoadingLogo: React.FC<LoadingLogoProps> = ({ size = 60, className }) => {
  return (
    <LoadingAnimatedSvg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="loadingVaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3d3f43" />
          <stop offset="100%" stopColor="#28272f" />
        </linearGradient>
        <linearGradient id="loadingDoorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2f" />
          <stop offset="100%" stopColor="#1a1a1f" />
        </linearGradient>
      </defs>
      
      {/* Vault/Safe body */}
      <rect 
        x="15" 
        y="15" 
        width="70" 
        height="70" 
        rx="6" 
        fill="url(#loadingVaultGradient)" 
        stroke="#756df4" 
        strokeWidth="2"
        className="vault-body"
      />
      
      {/* Vault door */}
      <rect 
        x="22" 
        y="22" 
        width="56" 
        height="56" 
        rx="4" 
        fill="url(#loadingDoorGradient)" 
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
        className="lock-mechanism-outer"
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
        className="lock-mechanism-middle"
      />
      
      {/* Lock mechanism - inner circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="5" 
        fill="#756df4"
        className="lock-center"
      />
      
      {/* Loading pixels in circle pattern */}
      <rect 
        x="8" 
        y="25" 
        width="3" 
        height="3" 
        fill="#756df4" 
        className="pixel-loading"
      />
      <rect 
        x="88" 
        y="30" 
        width="3" 
        height="3" 
        fill="#756df4" 
        className="pixel-loading"
      />
      <rect 
        x="12" 
        y="70" 
        width="3" 
        height="3" 
        fill="#756df4" 
        className="pixel-loading"
      />
      <rect 
        x="84" 
        y="65" 
        width="3" 
        height="3" 
        fill="#756df4" 
        className="pixel-loading"
      />
      <rect 
        x="92" 
        y="50" 
        width="3" 
        height="3" 
        fill="#756df4" 
        className="pixel-loading"
      />
      <rect 
        x="5" 
        y="45" 
        width="3" 
        height="3" 
        fill="#756df4" 
        className="pixel-loading"
      />
      <rect 
        x="25" 
        y="5" 
        width="3" 
        height="3" 
        fill="#756df4" 
        className="pixel-loading"
      />
      <rect 
        x="70" 
        y="92" 
        width="3" 
        height="3" 
        fill="#756df4" 
        className="pixel-loading"
      />
    </LoadingAnimatedSvg>
  );
};