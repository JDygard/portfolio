import React, { useCallback, useEffect, useRef } from 'react';
import './Skills.css';

const TIER_GAP = 7; // keep in sync with .skills-scroll gap
const FALLBACK_CHIP_H = 27; // tier-2 chip min-height
const DESKTOP_MQ = '(min-width: 1025px)';

function Skills({ groups = [], onSelectSkill }) {
  const scrollRef = useRef(null);

  // clip the tier stack so tier 1 sits fully in view and the next row is cut
  // in half — a bare hint that there is more to scroll to, no chrome needed
  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const desktop = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(DESKTOP_MQ).matches
      : true;
    const tiers = el.querySelectorAll('.skill-tier');
    if (!desktop || tiers.length < 2) {
      el.style.maxHeight = '';
      return;
    }
    const peekChip = tiers[1].querySelector('.skill-chip');
    const peek = Math.round((peekChip?.offsetHeight || FALLBACK_CHIP_H) / 2);
    el.style.maxHeight = `${tiers[0].offsetHeight + TIER_GAP + peek}px`;
  }, []);

  useEffect(() => {
    measure();
    if (typeof window === 'undefined') return undefined;
    window.addEventListener('resize', measure);
    let ro;
    if (typeof ResizeObserver !== 'undefined' && scrollRef.current) {
      ro = new ResizeObserver(measure);
      scrollRef.current.querySelectorAll('.skill-tier').forEach((t) => ro.observe(t));
    }
    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [measure, groups]);

  if (!groups.length) return null;

  return (
    <section className="skills" aria-labelledby="skills-heading">
      {/* most relevant tier first, descending from the top */}
      <div className="skills-scroll" ref={scrollRef}>
        {groups.map((group, idx) => (
          <ul
            key={group.label}
            className={`skill-tier skill-tier-${idx + 1}`}
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
      </div>
      <h3 id="skills-heading">Skills</h3>
    </section>
  );
}

export default Skills;
