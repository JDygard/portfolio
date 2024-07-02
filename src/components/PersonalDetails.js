import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { withTheme } from 'styled-components';
import MinimalistLines from '../decorations/MinimalistLines';

// Step 1: Define the fade-in keyframes animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledPortfolio = styled.div`
  grid-area: details;
  max-width: 300px;
  ul {
    list-style-type: none;
  }

  ${props => props.theme.name === "minimalist" && css`
    #personalDetailsDiv {
      display: grid;
    }

    h1 {
      font-size: 3rem;
      opacity: 0; // initially not visible
      animation: ${fadeIn} 1s forwards 3s;
    }

    p {
      & {
        opacity: 0; // initially not visible
      }

      &#about {
        animation: ${fadeIn} 1s forwards 2s;
        margin-bottom: 0;
        font-size: 1.5rem;
        justify-self: start;
      }

      &#role {
        animation: ${fadeIn} 1s forwards 2.5s;
        font-size: 1.2rem;
        justify-self: center;
      }
    }

    div > h1 {
      text-align: ${props => props.theme.personalDetails.textAlign || 'left'};
    }

    justify-self: ${props => props.theme.personalDetails.justifyContent || 'start'};
    display: flex;
    flex-direction: ${props => props.theme.personalDetails.flexDirection || 'column'};
  `};
`;


function PersonalDetails({ name, role, about, style, theme, styleType }) {
  return (
    <StyledPortfolio>
      <div id="personalDetailsDiv" style={style}>
        <p id="about">{about}</p>
        <p id="role">{role}</p>
        <h1 id="name">{name}</h1>
      </div>
    </StyledPortfolio>
  );
}

export default withTheme(PersonalDetails);
