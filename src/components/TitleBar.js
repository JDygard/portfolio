import React from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;

  // Custom styles for each styleType
  ${({ styleType }) => {
    if (styleType === "minimalist") {
      return `
        background-color: #fbf8f2;
      `;
    } else if (styleType === "groovy") {
      return `
        background-color: purple;
      `;
    }
  }}
`;

const StyleName = styled.span`
  margin: 0 15px;
  text-transform: capitalize;
`;

const Hamburger = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    // Add your hamburger styles
  }
`;

function TitleBar({ styles, styleType, onSelect }) {
  return (
    <>
      <Bar styleType={styleType}>
        {styles.map((style, index) => (
          <StyleName key={index} onClick={() => onSelect(style)}>
            {style}
          </StyleName>
        ))}
      </Bar>
      <Hamburger>
      </Hamburger>
    </>
  );
}

export default TitleBar;
