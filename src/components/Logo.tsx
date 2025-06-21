import React from 'react';
import styled from 'styled-components';

const AnimatedSvg = styled.svg`
  .lock-mechanism-outer {
    animation: rotate 6s linear infinite;
    transform-origin: 50px 50px;
  }
  
  .lock-mechanism-middle {
    animation: rotate-reverse 4s linear infinite;
    transform-origin: 50px 50px;
  }
  
  .lock-center {
    animation: pulse 2s ease-in-out infinite;
    transform-origin: 50px 50px;
  }
  
  .lock-handle {
    animation: handle-move 8s ease-in-out infinite;
    transform-origin: 50px 65px;
  }
  
  .vault-body {
    animation: vault-glow 3s ease-in-out infinite alternate;
  }
  
  .vault-door {
    animation: door-shimmer 4s ease-in-out infinite;
  }
  
  .pixel-float-1 {
    animation: pixel-float-1 4s ease-in-out infinite;
  }
  
  .pixel-float-2 {
    animation: pixel-float-2 3.5s ease-in-out infinite;
  }
  
  .pixel-float-3 {
    animation: pixel-float-3 4.5s ease-in-out infinite;
  }
  
  .pixel-float-4 {
    animation: pixel-float-4 3.8s ease-in-out infinite;
  }
  
  .pixel-small-1 {
    animation: pixel-twinkle 2s ease-in-out infinite;
    animation-delay: 0s;
  }
  
  .pixel-small-2 {
    animation: pixel-twinkle 2.5s ease-in-out infinite;
    animation-delay: -0.5s;
  }
  
  .pixel-small-3 {
    animation: pixel-twinkle 2.2s ease-in-out infinite;
    animation-delay: -1s;
  }
  
  .pixel-small-4 {
    animation: pixel-twinkle 2.8s ease-in-out infinite;
    animation-delay: -1.5s;
  }
  
  /* Hover effects */
  &:hover {
    .lock-mechanism-outer {
      animation-duration: 2s;
    }
    .lock-mechanism-middle {
      animation-duration: 1.5s;
    }
    .vault-body {
      animation: vault-unlock 0.8s ease-out;
    }
    .pixel-float-1, .pixel-float-2, .pixel-float-3, .pixel-float-4 {
      animation-duration: 1s;
    }
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes rotate-reverse {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }
  
  @keyframes pulse {
    0%, 100% { 
      transform: scale(1); 
      filter: brightness(1);
    }
    50% { 
      transform: scale(1.1); 
      filter: brightness(1.3);
    }
  }
  
  @keyframes handle-move {
    0%, 85%, 100% { transform: translateX(0px); }
    90%, 95% { transform: translateX(2px); }
  }
  
  @keyframes vault-glow {
    0% { 
      filter: drop-shadow(0 0 3px #756df4);
      stroke: #756df4;
    }
    100% { 
      filter: drop-shadow(0 0 12px #756df4) drop-shadow(0 0 20px rgba(117, 109, 244, 0.3));
      stroke: #9c88ff;
    }
  }
  
  @keyframes vault-unlock {
    0% { transform: scale(1); }
    30% { transform: scale(1.05); filter: drop-shadow(0 0 20px #756df4); }
    100% { transform: scale(1); }
  }
  
  @keyframes door-shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.9; filter: brightness(1.1); }
  }
  
  @keyframes pixel-float-1 {
    0%, 100% { 
      transform: translate(0px, 0px) rotate(0deg) scale(1); 
      opacity: 0.7; 
    }
    25% { 
      transform: translate(-2px, -3px) rotate(90deg) scale(1.1); 
      opacity: 1; 
    }
    50% { 
      transform: translate(1px, -5px) rotate(180deg) scale(0.9); 
      opacity: 0.8; 
    }
    75% { 
      transform: translate(3px, -2px) rotate(270deg) scale(1.05); 
      opacity: 0.9; 
    }
  }
  
  @keyframes pixel-float-2 {
    0%, 100% { 
      transform: translate(0px, 0px) rotate(0deg) scale(1); 
      opacity: 0.8; 
    }
    33% { 
      transform: translate(2px, -4px) rotate(-120deg) scale(1.2); 
      opacity: 1; 
    }
    66% { 
      transform: translate(-1px, -6px) rotate(-240deg) scale(0.8); 
      opacity: 0.6; 
    }
  }
  
  @keyframes pixel-float-3 {
    0%, 100% { 
      transform: translate(0px, 0px) rotate(0deg) scale(1); 
      opacity: 0.6; 
    }
    40% { 
      transform: translate(-3px, -2px) rotate(144deg) scale(1.15); 
      opacity: 0.9; 
    }
    80% { 
      transform: translate(2px, -4px) rotate(288deg) scale(0.95); 
      opacity: 1; 
    }
  }
  
  @keyframes pixel-float-4 {
    0%, 100% { 
      transform: translate(0px, 0px) rotate(0deg) scale(1); 
      opacity: 0.9; 
    }
    30% { 
      transform: translate(1px, -3px) rotate(-90deg) scale(0.9); 
      opacity: 0.7; 
    }
    60% { 
      transform: translate(-2px, -5px) rotate(-180deg) scale(1.1); 
      opacity: 1; 
    }
    90% { 
      transform: translate(2px, -1px) rotate(-270deg) scale(1.05); 
      opacity: 0.8; 
    }
  }
  
  @keyframes pixel-twinkle {
    0%, 100% { 
      opacity: 0.3; 
      transform: scale(0.8); 
    }
    50% { 
      opacity: 1; 
      transform: scale(1.2); 
      filter: brightness(1.5);
    }
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
        className="vault-body"
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
        className="vault-door"
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
      
      {/* Lock handle */}
      <rect 
        x="47.5" 
        y="62" 
        width="5" 
        height="8" 
        rx="2" 
        fill="#756df4"
        className="lock-handle"
      />
      
      {/* Animated pixel effects - scattered around */}
      <rect 
        x="8" 
        y="25" 
        width="4" 
        height="4" 
        fill="#756df4" 
        className="pixel-float-1"
      />
      <rect 
        x="88" 
        y="30" 
        width="4" 
        height="4" 
        fill="#756df4" 
        className="pixel-float-2"
      />
      <rect 
        x="12" 
        y="70" 
        width="4" 
        height="4" 
        fill="#756df4" 
        className="pixel-float-3"
      />
      <rect 
        x="84" 
        y="65" 
        width="4" 
        height="4" 
        fill="#756df4" 
        className="pixel-float-4"
      />
      
      {/* Additional smaller pixels with twinkle effect */}
      <rect 
        x="92" 
        y="50" 
        width="3" 
        height="3" 
        fill="#756df4" 
        opacity="0.8"
        className="pixel-small-1"
      />
      <rect 
        x="5" 
        y="45" 
        width="3" 
        height="3" 
        fill="#756df4" 
        opacity="0.8"
        className="pixel-small-2"
      />
      <rect 
        x="25" 
        y="5" 
        width="3" 
        height="3" 
        fill="#756df4" 
        opacity="0.6"
        className="pixel-small-3"
      />
      <rect 
        x="70" 
        y="92" 
        width="3" 
        height="3" 
        fill="#756df4" 
        opacity="0.6"
        className="pixel-small-4"
      />
    </AnimatedSvg>
  );
};