import React from 'react';
import styled from 'styled-components';
import { defaultTheme } from '../styleTypes';

const getTheme = (props) => props.theme?.skills ? props.theme : defaultTheme;

const StyledSkills = styled.section`
  grid-area: skills;
  justify-self: ${props => getTheme(props).skills.justifySelf};
  align-self: ${props => getTheme(props).skills.alignSelf};
  width: 100%;
  max-width: ${props => getTheme(props).skills.maxWidth};
  padding: ${props => getTheme(props).section.padding};
  background: ${props => getTheme(props).section.background};
  border: ${props => getTheme(props).section.border};
  border-radius: ${props => getTheme(props).section.borderRadius};
  box-shadow: ${props => getTheme(props).section.boxShadow};
  text-align: ${props => getTheme(props).skills.textAlign};
  transition: background-color 0.45s ease, border-color 0.45s ease, border-radius 0.45s ease, box-shadow 0.45s ease, color 0.45s ease;

  h3 {
    margin: 0 0 14px;
    color: ${props => getTheme(props).accentColor};
    font-size: ${props => getTheme(props).skills.headingSize};
    font-weight: ${props => getTheme(props).skills.headingWeight};
    text-transform: ${props => getTheme(props).skills.headingTransform};
  }

  ul {
    display: grid;
    gap: ${props => getTheme(props).skills.itemGap};
    max-height: ${props => getTheme(props).skills.listMaxHeight};
    margin: 0;
    padding: 0;
    overflow-y: ${props => getTheme(props).skills.overflowY};
    list-style: none;
    scrollbar-width: none;
  }

  ul::-webkit-scrollbar {
    display: none;
  }

  li {
    min-width: 0;
  }

  .skillLabel {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: ${props => getTheme(props).secondaryColor};
    font-size: 0.9rem;
  }

  .skillLevel {
    color: ${props => getTheme(props).mutedColor};
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: ${props => getTheme(props).skills.progressHeight};
  margin-top: 5px;
  overflow: hidden;
  background: ${props => getTheme(props).skills.progressBackground};
  border-radius: 999px;
`;

const ProgressBarFiller = styled.div`
  width: ${props => props.$width}%;
  height: 100%;
  background: ${props => getTheme(props).skills.progressFill};
  border-radius: inherit;
  transition: width 0.3s ease-in;
`;

function ProgressBar({ width }) {
  return (
    <ProgressBarContainer>
      <ProgressBarFiller $width={width} />
    </ProgressBarContainer>
  );
}

function Skills({ skillSet }) {
  return (
    <StyledSkills data-tween-id="skills" aria-labelledby="skills-heading">
      <h3 id="skills-heading">Skills</h3>
      <ul>
        {Object.entries(skillSet).map(([skill, level]) => (
          <li key={skill}>
            <span className="skillLabel">
              <span>{skill}</span>
              <span className="skillLevel">{level}</span>
            </span>
            <ProgressBar width={level} />
          </li>
        ))}
      </ul>
    </StyledSkills>
  );
}

export default Skills;
