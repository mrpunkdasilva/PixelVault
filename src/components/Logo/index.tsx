import React from 'react';
import './styles.scss';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 60, className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`animated-svg ${className || ''}`}
    >
      <defs>
        <linearGradient id='vaultGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#3d3f43' />
          <stop offset='100%' stopColor='#28272f' />
        </linearGradient>
        <linearGradient id='doorGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#2a2a2f' />
          <stop offset='100%' stopColor='#1a1a1f' />
        </linearGradient>
      </defs>

      {/* Vault/Safe body - maior */}
      <rect
        x='15'
        y='15'
        width='70'
        height='70'
        rx='6'
        fill='url(#vaultGradient)'
        stroke='#756df4'
        strokeWidth='2'
        className='vault-body'
      />

      {/* Vault door - maior */}
      <rect
        x='22'
        y='22'
        width='56'
        height='56'
        rx='4'
        fill='url(#doorGradient)'
        stroke='#756df4'
        strokeWidth='1.5'
        className='vault-door'
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

      {/* Lock handle */}
      <rect x='47.5' y='62' width='5' height='8' rx='2' fill='#756df4' className='lock-handle' />

      {/* Animated pixel effects - scattered around */}
      <rect x='8' y='25' width='4' height='4' fill='#756df4' className='pixel-float-1' />
      <rect x='88' y='30' width='4' height='4' fill='#756df4' className='pixel-float-2' />
      <rect x='12' y='70' width='4' height='4' fill='#756df4' className='pixel-float-3' />
      <rect x='84' y='65' width='4' height='4' fill='#756df4' className='pixel-float-4' />

      {/* Additional smaller pixels with twinkle effect */}
      <rect
        x='92'
        y='50'
        width='3'
        height='3'
        fill='#756df4'
        opacity='0.8'
        className='pixel-small-1'
      />
      <rect
        x='5'
        y='45'
        width='3'
        height='3'
        fill='#756df4'
        opacity='0.8'
        className='pixel-small-2'
      />
      <rect
        x='25'
        y='5'
        width='3'
        height='3'
        fill='#756df4'
        opacity='0.6'
        className='pixel-small-3'
      />
      <rect
        x='70'
        y='92'
        width='3'
        height='3'
        fill='#756df4'
        opacity='0.6'
        className='pixel-small-4'
      />
    </svg>
  );
};
