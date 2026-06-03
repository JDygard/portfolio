import React from 'react';
import './Skills.css';

function ProgressBar({ width }) {
  return (
    <div className="progressBar">
      <div className="progressFill" style={{ width: `${width}%` }} />
    </div>
  );
}

function Skills({ skillSet }) {
  return (
    <section className="skills" data-tween-id="skills" aria-labelledby="skills-heading">
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
    </section>
  );
}

export default Skills;
