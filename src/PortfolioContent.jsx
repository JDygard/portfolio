import React from 'react';
// Components
import ProfilePicture from './components/ProfilePicture';
import PersonalDetails from './components/PersonalDetails';
import PortfolioItems from './components/PortfolioItems';
import ContactLinks from './components/ContactLinks';
import Timeline from './components/Timeline';
// Content
import { minimalistContent } from './helpers/content';
import timelineData from './data/timeline.json';
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
      <Timeline data={timelineData} />
      <ContactLinks links={minimalistContent.contactLinks} />
      <PortfolioItems items={minimalistContent.portfolioItems} />
    </main>
  );
}

export default PortfolioContent;
