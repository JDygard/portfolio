import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { withTheme } from 'styled-components';

const StyledContact = styled.div`
  grid-area: contacts;
  ul {
    list-style-type: none;
  }
  
  justify-self: ${props => props.theme.contactLinks.justifyContent || 'start'};
`;

function ContactLinks({ links, theme }) {
  return (
    <StyledContact>
      <h3>Contact & Profiles</h3>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <Button href={link.url} target="_blank" rel="noopener noreferrer">
              {link.platform}
            </Button>
          </li>
        ))}
      </ul>
    </StyledContact>
  );
}

export default withTheme(ContactLinks);

