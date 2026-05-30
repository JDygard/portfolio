import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { defaultTheme } from '../styleTypes';

const getTheme = (props) => props.theme?.contacts ? props.theme : defaultTheme;

const StyledContact = styled.section`
  grid-area: contacts;
  justify-self: ${props => getTheme(props).contacts.justifySelf};
  align-self: ${props => getTheme(props).contacts.alignSelf};
  width: 100%;
  max-width: ${props => getTheme(props).contacts.maxWidth};
  padding: ${props => getTheme(props).section.padding};
  background: ${props => getTheme(props).section.background};
  border: ${props => getTheme(props).section.border};
  border-top: ${props => getTheme(props).contacts.borderTop};
  border-radius: ${props => getTheme(props).section.borderRadius};
  box-shadow: ${props => getTheme(props).section.boxShadow};
  text-align: ${props => getTheme(props).contacts.textAlign};
  transition: background-color 0.45s ease, border-color 0.45s ease, border-radius 0.45s ease, box-shadow 0.45s ease, color 0.45s ease;

  h3 {
    margin: 0 0 12px;
    color: ${props => getTheme(props).accentColor};
    font-size: ${props => getTheme(props).contacts.headingSize};
    font-weight: 700;
    text-transform: ${props => getTheme(props).name === 'minimalist' ? 'none' : 'uppercase'};
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: ${props => getTheme(props).contacts.textAlign === 'right' ? 'flex-end' : 'flex-start'};
    gap: ${props => getTheme(props).name === 'technical' ? '6px' : '0'};
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: ${props => getTheme(props).contacts.itemDisplay};
  }

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: left;

    ul {
      justify-content: flex-start;
    }
  }
`;

const getContactHref = (link) => {
  if (link.type === "Email") {
    return `mailto:${link.value}`;
  }

  if (link.type === "Phone") {
    return `tel:${link.value.replace(/[^+\d]/g, '')}`;
  }

  return link.value;
};

function ContactLinks({ links }) {
  return (
    <StyledContact data-tween-id="contact" aria-labelledby="contact-heading">
      <h3 id="contact-heading">Contact</h3>
      <ul>
        {links.map((link) => (
          <li key={link.type}>
            <Button href={getContactHref(link)} target={link.type === "Email" || link.type === "Phone" ? undefined : "_blank"} rel="noopener noreferrer">
              {link.type === "Email" || link.type === "Phone" ? link.value : link.type}
            </Button>
          </li>
        ))}
      </ul>
    </StyledContact>
  );
}

export default ContactLinks;
