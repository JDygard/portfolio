import React from 'react';
import styled from 'styled-components';
import { defaultTheme } from '../styleTypes';

const getTheme = (props) => props.theme?.switcher ? props.theme : defaultTheme;

const Bar = styled.nav`
  position: fixed;
  top: 16px;
  left: 50%;
  z-index: 20;
  transform: translateX(-50%);
  max-width: calc(100vw - 32px);
  overflow-x: auto;
`;

const Rail = styled.div`
  display: flex;
  gap: 6px;
  padding: 6px;
  background: ${props => getTheme(props).switcher.background};
  color: ${props => getTheme(props).switcher.color};
  border: ${props => getTheme(props).switcher.border};
  border-radius: 8px;
  box-shadow: 0 14px 42px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(12px);
`;

const StyleButton = styled.button`
  min-width: 94px;
  border: 0;
  border-radius: 6px;
  padding: 8px 12px;
  background: ${props => props.$active ? getTheme(props).switcher.activeBackground : 'transparent'};
  color: ${props => props.$active ? getTheme(props).switcher.activeColor : 'inherit'};
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${props => props.$active ? getTheme(props).switcher.activeBackground : 'rgba(127, 127, 127, 0.14)'};
  }

  &:focus-visible {
    outline: 2px solid ${props => getTheme(props).accentColor};
    outline-offset: 2px;
  }
`;

const Label = styled.span`
  display: block;
  font-size: 0.88rem;
  font-weight: 700;
`;

const Description = styled.span`
  display: block;
  margin-top: 2px;
  color: currentColor;
  font-size: 0.7rem;
  opacity: 0.72;
`;

function TitleBar({ styles, styleType, onSelect }) {
  return (
    <Bar aria-label="Portfolio style">
      <Rail>
        {styles.map((style) => (
          <StyleButton
            key={style.id}
            type="button"
            $active={style.id === styleType}
            aria-pressed={style.id === styleType}
            onClick={() => onSelect(style.id)}
          >
            <Label>{style.label}</Label>
            <Description>{style.description}</Description>
          </StyleButton>
        ))}
      </Rail>
    </Bar>
  );
}

export default TitleBar;
