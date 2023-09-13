import React from 'react';
import styled from 'styled-components';

const StyledSkills = styled.div`
  /* default styles */
  grid-area: skills;
  ul {
    list-style-type: none;
    padding: 0;
  }

  ${props => props.styleType === 'minimalist' && `
  
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
    height: 1px;
    background-color: #e0e0e0;
    border-radius: 8px;
    border: 1px solid #505564;
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
      <ul>
        {Object.entries(skillSet).map(([skill, level], index) => (
          <li key={index}>
            {skill}: {level}%
            <ProgressBar width={level} styleType={styleType} />
          </li>
        ))}
      </ul>
    </StyledSkills>
  );
}

export default Skills;
