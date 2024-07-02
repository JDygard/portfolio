import React from 'react';
import styled from 'styled-components';
// Components
import TitleBar from './components/TitleBar';
import ProfilePicture from './components/ProfilePicture';
import PersonalDetails from './components/PersonalDetails';
import PortfolioItems from './components/PortfolioItems';
import ContactLinks from './components/ContactLinks';
import Skills from './components/Skills';
// Content
import { skillsCommon, commonPortfolioItems, minimalistContent, groovyContent, artsyContent } from './helpers/content';
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
figure {
  margin-right: 15px;
}

figcaption {
  font-size: 0.8rem;  /* Adjust as needed */
  color: #888;       /* Adjust as needed */
  text-align: center;
}
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
    case "professional":
      selectedTheme = groovyTheme;
      profileContent = groovyContent;
      break;
    case "technical":
      selectedTheme = artsyTheme;
      profileContent = artsyContent;
      break;
    default:
      console.error("DEFAULT style type selected");
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

          <ContactLinks links={profileContent.contactLinks} styleType={styleType} />

          <PortfolioItems items={profileContent.portfolioItems} commonPortfolioItems={commonPortfolioItems} styleType={styleType} />
        </Content>
      </div>
    </ThemeProvider>
  );
}

export default PortfolioContent;
