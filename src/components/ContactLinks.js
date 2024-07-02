import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import Button from './Button';
import { withTheme } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledContact = styled.div`
  flex-direction: column;
  grid-area: contacts;
  border-top: 1px solid #000;
  ul {
    list-style-type: none;
  }

  ${props => props.styleType === 'minimalist' && css`
    animation: ${fadeIn} 1s forwards 2.6s !important;
    opacity: 0; 
    text-align: right;
    h3 {
      margin-bottom: 0;
      font-size: 1.3rem;
    }
 `}
  
  justify-self: ${props => props.theme.contactLinks.justifyContent || 'start'};
`;

function ContactLinks({ links, theme, styleType }) {
  return (
    <StyledContact styleType={styleType}>
      <h3>Contact</h3>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            {link.type === "Phone" || link.type === "Email" ? (
              <Button styleType={styleType}>
                {link.value}
              </Button>
            ) : (
              <Button href={link.value} styleType={styleType} target="_blank" rel="noopener noreferrer">
                {link.type}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </StyledContact>
  );
}

export default withTheme(ContactLinks);