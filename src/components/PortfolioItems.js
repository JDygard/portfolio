import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import Button from './Button';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledPortfolio = styled.div`
  grid-area: portfolio;
  li, ul {
    list-style-type: none;
  }

  ${props => props.styleType === 'minimalist' && css`
  
  #portfolioItems {
    background: red; // temporary, just to see if the style is applied
    animation: ${fadeIn} 1s forwards 2s !important;
    opacity: 0 !important; 
  }
  li, ul {
    list-style-type: none;
  }
  .portfolioItems {
      width: 30vw;
  }
  `}

  ${props => props.styleType === 'groovy' && `
    /* groovy specific styles */
  `}

  ${props => props.styleType === 'artsy' && `
    /* artsy specific styles */
  `}
`;


function PortfolioItems({ items, style, styleType }) {
  console.log(styleType)
  return (
    <StyledPortfolio styleType={styleType} id="portfolioItems">
      <h3>Portfolio</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Button href={item.link} styleType={styleType} target="_blank" rel="noopener noreferrer">
              {item.name}
            </Button>
          </li>
        ))}
      </ul>
    </StyledPortfolio>
  );
}

export default PortfolioItems;
