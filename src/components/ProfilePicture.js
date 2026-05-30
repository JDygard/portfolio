import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { defaultTheme } from '../styleTypes';

const getTheme = (props) => props.theme?.profilePicture ? props.theme : defaultTheme;

const draw = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const ImageContainer = styled.div`
  grid-area: pic;
  justify-self: ${props => getTheme(props).profilePicture.justifySelf};
  align-self: ${props => getTheme(props).profilePicture.alignSelf};
  width: ${props => getTheme(props).profilePicture.width};
  height: ${props => getTheme(props).profilePicture.height};
  min-height: ${props => getTheme(props).profilePicture.minHeight || '0'};
  padding: ${props => getTheme(props).profilePicture.padding};
  overflow: ${props => getTheme(props).profilePicture.overflow};
  background: ${props => getTheme(props).profilePicture.background};
  border: ${props => getTheme(props).profilePicture.border};
  border-radius: ${props => getTheme(props).profilePicture.borderRadius};
  box-shadow: ${props => getTheme(props).profilePicture.boxShadow};
  position: relative;

  &::after {
    content: "";
    display: ${props => getTheme(props).profilePicture.scanline ? 'block' : 'none'};
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: ${props => getTheme(props).profilePicture.scanline || 'transparent'};
    mix-blend-mode: screen;
  }

  #profilePicture {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  svg {
    width: ${props => getTheme(props).profilePicture.svgWidth};
    height: ${props => getTheme(props).profilePicture.svgHeight};
    overflow: visible;
    transform: ${props => getTheme(props).profilePicture.transform};
    transform-origin: ${props => getTheme(props).profilePicture.transformOrigin};
    filter: ${props => getTheme(props).profilePicture.filter || 'none'};
  }

  .face_svg__cls-1 {
    fill: ${props => getTheme(props).profilePicture.pathFill} !important;
    opacity: ${props => getTheme(props).profilePicture.pathOpacity};
    stroke: ${props => getTheme(props).profilePicture.pathStroke} !important;
    stroke-width: ${props => getTheme(props).profilePicture.pathStrokeWidth} !important;
    transition: fill 0.3s ease, stroke 0.3s ease, opacity 0.3s ease;

    ${props => props.$drawn ? css`
      animation: none !important;
      stroke-dashoffset: 0 !important;
    ` : css`
      animation: ${draw} ${getTheme(props).profilePicture.animationDuration} forwards;
    `}
  }

  path.face_svg__cls-1:nth-of-type(1) {
    animation-delay: ${props => getTheme(props).profilePicture.pathDelayOne};
  }

  path.face_svg__cls-1:nth-of-type(2) {
    animation-delay: ${props => getTheme(props).profilePicture.pathDelayTwo};
  }

  path.face_svg__cls-1:nth-of-type(3) {
    animation-delay: ${props => getTheme(props).profilePicture.pathDelayThree};
  }

  @media (max-width: 768px) {
    width: ${props => getTheme(props).mobileProfilePicture.width};
    height: ${props => getTheme(props).mobileProfilePicture.height};
    min-height: 320px;
    justify-self: ${props => getTheme(props).mobileProfilePicture.justifySelf};
    position: ${props => getTheme(props).mobileProfilePicture.position};
    z-index: ${props => getTheme(props).mobileProfilePicture.zIndex};

    svg {
      width: 118%;
    }
  }
`;

function ProfilePicture({ SvgComponent, style }) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDrawn(true), 4600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <ImageContainer data-tween-id="profile" $drawn={drawn}>
      <div style={style} id="profilePicture">
        <SvgComponent alt="Developer's Profile" />
      </div>
    </ImageContainer>
  );
}

export default ProfilePicture;
