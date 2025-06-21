import React from 'react';
import styled from 'styled-components';
import { Logo } from './Logo';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const BrandText = styled.div`
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #756df4 0%, #9c88ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

const SubText = styled.div`
  font-size: 12px;
  color: #756df4;
  opacity: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: -4px;
`;

interface LogoWithTextProps {
  size?: number;
  showSubtext?: boolean;
  className?: string;
}

export const LogoWithText: React.FC<LogoWithTextProps> = ({ 
  size = 50, 
  showSubtext = false, 
  className 
}) => {
  return (
    <LogoContainer className={className}>
      <Logo size={size} />
      <div>
        <BrandText>PixelVault</BrandText>
        {showSubtext && <SubText>Secure Photo Storage</SubText>}
      </div>
    </LogoContainer>
  );
};