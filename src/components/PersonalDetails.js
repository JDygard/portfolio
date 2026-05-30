import React from 'react';
import styled from 'styled-components';
import { defaultTheme } from '../styleTypes';

const getTheme = (props) => props.theme?.personalDetails ? props.theme : defaultTheme;

const StyledPortfolio = styled.section`
  grid-area: details;
  justify-self: ${props => getTheme(props).personalDetails.justifySelf};
  align-self: ${props => getTheme(props).personalDetails.alignSelf};
  width: 100%;
  max-width: ${props => getTheme(props).personalDetails.maxWidth};
  padding: ${props => getTheme(props).personalDetails.padding};
  background: ${props => getTheme(props).personalDetails.background};
  border: ${props => getTheme(props).personalDetails.border};
  border-radius: ${props => getTheme(props).personalDetails.borderRadius};
  box-shadow: ${props => getTheme(props).personalDetails.boxShadow || 'none'};
  color: ${props => getTheme(props).secondaryColor};
  transition: background-color 0.45s ease, border-color 0.45s ease, border-radius 0.45s ease, box-shadow 0.45s ease, color 0.45s ease;

  #personalDetailsDiv {
    display: ${props => getTheme(props).personalDetails.display};
    flex-direction: ${props => getTheme(props).personalDetails.flexDirection || 'column'};
    gap: ${props => getTheme(props).personalDetails.gap};
    text-align: ${props => getTheme(props).personalDetails.textAlign};
  }

  h1,
  p {
    transition: color 0.45s ease, font-size 0.45s ease, font-weight 0.45s ease;
  }

  h1 {
    order: ${props => getTheme(props).personalDetails.nameOrder};
    margin: 0;
    font-size: ${props => getTheme(props).personalDetails.nameSize};
    font-weight: ${props => getTheme(props).personalDetails.nameWeight};
    line-height: 0.94;
  }

  #about {
    order: ${props => getTheme(props).personalDetails.aboutOrder};
    margin: 0;
    color: ${props => getTheme(props).secondaryColor};
    font-size: ${props => getTheme(props).personalDetails.aboutSize};
    font-weight: ${props => getTheme(props).personalDetails.aboutWeight};
    line-height: 1.4;
  }

  #role {
    order: ${props => getTheme(props).personalDetails.roleOrder};
    margin: 0;
    color: ${props => getTheme(props).accentColor};
    font-size: ${props => getTheme(props).personalDetails.roleSize};
    font-weight: ${props => getTheme(props).personalDetails.roleWeight};
    line-height: 1.4;
    text-transform: ${props => getTheme(props).name === 'minimalist' ? 'none' : 'uppercase'};
  }

  @media (max-width: 768px) {
    position: ${props => getTheme(props).mobilePersonalDetails.position};
    z-index: ${props => getTheme(props).mobilePersonalDetails.zIndex};
    top: ${props => getTheme(props).mobilePersonalDetails.top};
    max-width: 100%;

    #personalDetailsDiv {
      text-align: left;
    }

    h1 {
      font-size: 2.45rem;
      line-height: 1;
    }
  }
`;

function PersonalDetails({ name, role, about, style }) {
  return (
    <StyledPortfolio data-tween-id="details" aria-labelledby="name">
      <div id="personalDetailsDiv" style={style}>
        <p id="about">{about}</p>
        <p id="role">{role}</p>
        <h1 id="name">{name}</h1>
      </div>
    </StyledPortfolio>
  );
}

export default PersonalDetails;
