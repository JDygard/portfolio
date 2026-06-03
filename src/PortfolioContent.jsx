import React from 'react';
// Components
import ProfilePicture from './components/ProfilePicture';
import PersonalDetails from './components/PersonalDetails';
import PortfolioItems from './components/PortfolioItems';
import ContactLinks from './components/ContactLinks';
import Skills from './components/Skills';
// Content
import { skillsCommon, minimalistContent } from './helpers/content';
import './PortfolioContent.css';

function PortfolioContent() {
  return (
    <main className="content">
      <ProfilePicture SvgComponent={minimalistContent.SvgComponent} />
      <PersonalDetails
        name={minimalistContent.personalDetails.name}
        role={minimalistContent.personalDetails.role}
        about={minimalistContent.personalDetails.about}
      />
      <Skills skillSet={skillsCommon} />
      <ContactLinks links={minimalistContent.contactLinks} />
      <PortfolioItems items={minimalistContent.portfolioItems} />
    </main>
  );
}

export default PortfolioContent;
