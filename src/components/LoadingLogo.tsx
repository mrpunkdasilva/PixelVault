import React from 'react';
import './LoadingLogo.scss';

interface LoadingLogoProps {
  size?: number;
  className?: string;
}

export const LoadingLogo: React.FC<LoadingLogoProps> = ({ size = 60, className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`loading-animated-svg ${className || ''}`}
    >
      <defs>
        <linearGradient id='loadingVaultGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#3d3f43' />
          <stop offset='100%' stopColor='#28272f' />
        </linearGradient>
        <linearGradient id='loadingDoorGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#2a2a2f' />
          <stop offset='100%' stopColor='#1a1a1f' />
        </linearGradient>
      </defs>

      {/* Vault/Safe body */}
      <rect
        x='15'
        y='15'
        width='70'
        height='70'
        rx='6'
        fill='url(#loadingVaultGradient)'
        stroke='#756df4'
        strokeWidth='2'
        className='vault-body'
      />

      {/* Vault door */}
      <rect
        x='22'
        y='22'
        width='56'
        height='56'
        rx='4'
        fill='url(#loadingDoorGradient)'
        stroke='#756df4'
        strokeWidth='1.5'
      />

      {/* Lock mechanism - outer ring */}
      <circle
        cx='50'
        cy='50'
        r='12'
        fill='none'
        stroke='#756df4'
        strokeWidth='2.5'
        className='lock-mechanism-outer'
      />

      {/* Lock mechanism - middle ring */}
      <circle
        cx='50'
        cy='50'
        r='8'
        fill='none'
        stroke='#756df4'
        strokeWidth='1.5'
        opacity='0.7'
        className='lock-mechanism-middle'
      />

      {/* Lock mechanism - inner circle */}
      <circle cx='50' cy='50' r='5' fill='#756df4' className='lock-center' />

      {/* Loading pixels in circle pattern */}
      <rect x='8' y='25' width='3' height='3' fill='#756df4' className='pixel-loading' />
      <rect x='88' y='30' width='3' height='3' fill='#756df4' className='pixel-loading' />
      <rect x='12' y='70' width='3' height='3' fill='#756df4' className='pixel-loading' />
      <rect x='84' y='65' width='3' height='3' fill='#756df4' className='pixel-loading' />
      <rect x='92' y='50' width='3' height='3' fill='#756df4' className='pixel-loading' />
      <rect x='5' y='45' width='3' height='3' fill='#756df4' className='pixel-loading' />
      <rect x='25' y='5' width='3' height='3' fill='#756df4' className='pixel-loading' />
      <rect x='70' y='92' width='3' height='3' fill='#756df4' className='pixel-loading' />
    </svg>
  );
};
