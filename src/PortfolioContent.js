import React from 'react';
import styled, { css } from 'styled-components';
// Components
import TitleBar from './components/TitleBar';
import StyleSelector from './StyleSelector';
import ProfilePicture from './components/ProfilePicture';
import PersonalDetails from './components/PersonalDetails';
import PortfolioItems from './components/PortfolioItems';
import ContactLinks from './components/ContactLinks';
import Skills from './components/Skills';
// Content
import { skillsCommon, minimalistContent, groovyContent, artsyContent } from './helpers/content';
import { GlobalStyles } from './GlobalStyles';
import { styleTypes } from './styleTypes';
import { ThemeProvider } from 'styled-components';
import { minimalistTheme, groovyTheme, artsyTheme } from './helpers/themes';

const Content = styled.div`
transition: all 0.3s;
display: grid;
grid-template-columns: repeat(12, 1fr);
margin-left: ${props => props.theme.marginLeft || 'auto'};
margin-top: ${props => props.theme.marginTop || 'auto'};
background-color: ${props => props.theme.primaryColor};
color: ${props => props.theme.secondaryColor};
background-image: ${props => props.theme.background};
font-family: ${props => props.theme.primaryFont};
grid-template-areas: ${props => props.theme.gridTemplate};

.profilePicture {
  height: ${props => props.theme.profilePicture.height};
  width: ${props => props.theme.profilePicture.width};
}
`;

function PortfolioContent({ styleType, onSelectStyle }) {

  let selectedTheme;
  let profileContent;
  switch (styleType) {
    case "minimalist":
      selectedTheme = minimalistTheme;
      profileContent = minimalistContent;
      break;
    case "groovy":
      selectedTheme = groovyTheme;
      profileContent = groovyContent;
      break;
    case "artsy":
      selectedTheme = artsyTheme;
      profileContent = artsyContent;
      break;
    default:
      profileContent = minimalistContent;
  }

  return (
    <ThemeProvider theme={selectedTheme}>
      <GlobalStyles styleType={styleType} />
      <div>
        <TitleBar styles={styleTypes} styleType={styleType} onSelect={onSelectStyle} />
        <Content styleType={styleType}>
          <ProfilePicture SvgComponent={profileContent.SvgComponent} styleType={styleType} />

          <PersonalDetails
            name={profileContent.personalDetails.name}
            role={profileContent.personalDetails.role}
            about={profileContent.personalDetails.about}
            styleType={styleType}
          />

          <Skills skillSet={skillsCommon} styleType={styleType} />

          <PortfolioItems items={profileContent.portfolioItems} styleType={styleType} />

          <ContactLinks links={profileContent.contactLinks} styleType={styleType} />
        </Content>
      </div>
    </ThemeProvider>
  );
}

export default PortfolioContent;
