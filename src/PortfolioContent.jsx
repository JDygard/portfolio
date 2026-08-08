import React, { useState } from 'react';
// Components
import ProfilePicture from './components/ProfilePicture';
import PersonalDetails from './components/PersonalDetails';
import Skills from './components/Skills';
import ContactLinks from './components/ContactLinks';
import Timeline from './components/Timeline';
// Content
import { content } from './helpers/content';
import timelineData from './data/timeline.json';
import { track } from './analytics';
import './PortfolioContent.css';

function PortfolioContent() {
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);

  const openTimelineWithSkill = (skill) => {
    track('skill-chip', { skill });
    setActiveSkill(skill);
    setTimelineOpen(true);
  };

  return (
    <main className="content">
      <ProfilePicture SvgComponent={content.SvgComponent} />
      <PersonalDetails
        name={content.personalDetails.name}
        role={content.personalDetails.role}
        about={content.personalDetails.about}
      />
      <Skills groups={timelineData.skillGroups} onSelectSkill={openTimelineWithSkill} />
      <Timeline
        data={timelineData}
        isOpen={timelineOpen}
        onOpen={() => {
          track('timeline-open', { source: 'direct' });
          setTimelineOpen(true);
        }}
        onClose={() => {
          setTimelineOpen(false);
          setActiveSkill(null);
        }}
        activeSkill={activeSkill}
        onSkillChange={(skill) => {
          if (skill) track('timeline-filter', { skill });
          setActiveSkill(skill);
        }}
      />
      <ContactLinks links={content.contactLinks} />
    </main>
  );
}

export default PortfolioContent;
