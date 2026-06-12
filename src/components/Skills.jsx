import React from 'react';
import './Skills.css';

function Skills({ groups = [], onSelectSkill }) {
  if (!groups.length) return null;

  // least relevant tier on top, most relevant at the bottom, label last
  const ordered = [...groups].reverse();

  return (
    <section className="skills" aria-labelledby="skills-heading">
      {ordered.map((group, idx) => (
        <ul
          key={group.label}
          className={`skill-tier skill-tier-${ordered.length - idx}`}
          aria-label={group.label}
        >
          {group.skills.map((skill) => (
            <li key={skill}>
              <button
                type="button"
                className="skill-chip"
                onClick={() => onSelectSkill(skill)}
              >
                {skill}
              </button>
            </li>
          ))}
        </ul>
      ))}
      <h3 id="skills-heading">Skills</h3>
    </section>
  );
}

export default Skills;
