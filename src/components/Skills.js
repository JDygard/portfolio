import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledSkills = styled.div`
  /* default styles */
  grid-area: skills;
  ul {
    list-style-type: none;
    padding: 0;
  }

  ${props => props.styleType === 'minimalist' && css`
    .skillsList {
      max-height: 165px;
      overflow-y: scroll;
      scrollbar-width: none;
      overflow: -moz-scrollbars-none; /* For Firefox */
      -ms-overflow-style: none; /* For Internet Explorer and Edge */
    }

    .skillsList::-webkit-scrollbar {
      display: none;
      width: 0 !important;
      height: 0;
      background: transparent; /* For Chrome, Safari, and Opera */
    }
    

    .skillsList > li {
      margin-left: 10px;
      max-width: 280px;
    }

    li > span {
      margin-left: 5px;
    }

    animation: ${fadeIn} 1s forwards 2.6s !important;
    opacity: 0; 
    max-width: 300px;
  `}

  ${props => props.styleType === 'groovy' && `
    /* groovy specific styles */
  `}

  ${props => props.styleType === 'artsy' && `
    /* artsy specific styles */
  `}
`;

const ProgressBarContainer = styled.div`
${props => props.styleType === 'minimalist' && `
    width: 100%;
    height: 2px;
    background-color: #d09d9d;
    border-radius: 8px;
    margin: 5px 0;
  `}
`;

const ProgressBarFiller = styled.div`
  width: ${props => props.width}%;
  height: 100%;
  background-color: black;
  border-radius: inherit;
  transition: width 0.2s ease-in;
`;

function ProgressBar({ width, styleType }) {
  return (
    <ProgressBarContainer styleType={styleType}>
      <ProgressBarFiller width={width} />
    </ProgressBarContainer>
  );
}

function Skills({ skillSet, styleType }) {
  return (
    <StyledSkills styleType={styleType}>
      <h3>Skills</h3>
      <ul className="skillsList">
        {Object.entries(skillSet).map(([skill, level], index) => (
          <li key={index}>
            <span>
              {skill}<ProgressBar width={level} styleType={styleType} />
            </span>
          </li>
        ))}
      </ul>
    </StyledSkills>
  );
}

export default Skills;
