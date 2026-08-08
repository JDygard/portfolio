import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { track } from '../analytics';
import './Timeline.css';

const NOW_YEAR = new Date().getFullYear();
const PX_PER_UNIT = 150; // desktop horizontal scale for one quiet year
const V_PX_PER_UNIT = 110; // mobile vertical scale for one quiet year
const MOBILE_MQ = '(max-width: 768px)';
const OPEN_RUNOFF = 1.4; // years of track past 'now' for ongoing items to run off & fade
const MIN_YEAR_UNITS = 1;
const ITEM_SLOT_UNITS = 0.9;
const POINT_BLOCK_RATIO = 0.78;
const SIDE_PROJECT_UNITS = { 1: 0.16, 2: 0.2, 3: 0.26, 4: 0.45, 5: 0.6 };
const LANE_BASE_HEIGHT = { employment: 88, project: 66, education: 80 };
const LANE_ROW_GAP = 10;
const LANE_ORDER = ['employment', 'project', 'education'];
const MONTH_LABELS = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const endYear = (item) => (item.end == null ? NOW_YEAR : item.end);
const monthOrder = (item) => (Number.isFinite(item.startMonth) ? item.startMonth : 13);
const isMonthScaleItem = (item) => item.end === item.start && Number.isFinite(item.startMonth);
const importance = (item) => Math.max(1, Math.min(5, Number.isFinite(item.importance) ? item.importance : 5));
const monthSlotUnits = (item) => (item.side ? SIDE_PROJECT_UNITS[importance(item)] : ITEM_SLOT_UNITS);

const PARENT_HEADER_H = 62; // employer header (years/title/role) atop the expanded overlay
const CHILD_GAP = 4;
const childCardHeight = (project) => {
  const lvl = importance(project);
  return lvl >= 5 ? 44 : lvl === 4 ? 28 : 24;
};
const expandedParentHeight = (children = []) => {
  let h = PARENT_HEADER_H + 10;
  children.forEach((p, i) => { h += (i ? CHILD_GAP : 0) + childCardHeight(p); });
  return h;
};

const yearLabel = (item) => {
  if (isMonthScaleItem(item)) {
    const endMonth = Number.isFinite(item.endMonth) ? item.endMonth : item.startMonth;
    const startLabel = MONTH_LABELS[item.startMonth] || item.startMonth;
    const endLabel = MONTH_LABELS[endMonth] || endMonth;
    return endMonth === item.startMonth
      ? `${startLabel} ${item.start}`
      : `${startLabel}-${endLabel} ${item.start}`;
  }

  if (item.end === item.start) return `${item.start}`;

  return `${item.start} - ${item.end == null ? 'now' : item.end}`;
};

function ProjectLinks({ links = [] }) {
  if (!links.length) return null;

  return (
    <div className="tl-tip-links">
      {links.map((l) => (
        <a
          key={l.url}
          className={l.primary ? 'is-primary' : undefined}
          href={l.url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={(e) => {
            e.stopPropagation();
            track('project-link', { label: l.label, url: l.url });
          }}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

function Tip({ item, side, up, showTitle = false }) {
  const cls = ['tl-tip'];
  if (side === 'right') cls.push('tl-tip-left');
  if (up) cls.push('tl-tip-up');
  return (
    <div className={cls.join(' ')} role="tooltip">
      {showTitle && <div className="tl-tip-title">{item.title}</div>}
      {item.role && <div className="tl-tip-role">{item.role}</div>}
      {item.location && <div className="tl-tip-loc">{item.location}</div>}
      <p className="tl-tip-summary">{item.summary}</p>
      <ProjectLinks links={item.links} />
    </div>
  );
}

function DetailPopover({ item, anchorEl, accent }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!anchorEl) return undefined;
    const place = () => {
      const el = ref.current;
      if (!el) return;
      const a = anchorEl.getBoundingClientRect();
      const p = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const M = 10;
      const GAP = 12;
      // anchor to the block itself: open beside whichever edge has room
      let left = a.right + GAP;
      if (left + p.width + M > vw) left = a.left - GAP - p.width;
      left = Math.max(M, Math.min(left, vw - p.width - M));
      // vertically aligned with the top of the block
      let top = a.top;
      top = Math.max(M, Math.min(top, vh - p.height - M));
      setPos({ left, top });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [anchorEl, item]);

  if (!item) return null;

  return createPortal(
    <div
      ref={ref}
      className="tl-tip tl-pop"
      role="tooltip"
      style={{
        left: pos ? `${pos.left}px` : '-9999px',
        top: pos ? `${pos.top}px` : '-9999px',
        visibility: pos ? 'visible' : 'hidden',
        '--c': accent,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="tl-tip-eyebrow">{yearLabel(item)}</div>
      <div className="tl-tip-title">{item.title}</div>
      {item.role && <div className="tl-tip-role">{item.role}</div>}
      {item.location && <div className="tl-tip-loc">{item.location}</div>}
      {item.summary && <p className="tl-tip-summary">{item.summary}</p>}
      <ProjectLinks links={item.links} />
    </div>,
    document.body,
  );
}

function Block({ item, categories, style, associatedItems, isActive, activeChildId, skillStateFor = () => null, setAnchor, onHover, onLeave, onToggle, onToggleChild }) {
  const color = categories[item.category]?.color || '#888';
  const isSideProject = item.category === 'project' && item.side;
  const visualLevel = isSideProject ? importance(item) : 5;
  const hasAssociatedItems = associatedItems && associatedItems.length > 0;
  const skillState = skillStateFor(item.id);
  const cls = [
    'tl-block',
    `tl-${item.category}`,
    item.side ? 'tl-side' : '',
    hasAssociatedItems ? 'tl-has-children' : '',
    hasAssociatedItems && isActive ? 'tl-expanded' : '',
    isSideProject ? `tl-importance-${visualLevel}` : '',
    isSideProject && visualLevel <= 3 ? 'tl-dot-project' : '',
    isSideProject && visualLevel === 4 ? 'tl-named-project' : '',
    item.end == null ? 'tl-ongoing' : '',
    isActive ? 'is-active' : '',
    skillState === 'hit' ? 'tl-skill-hit' : '',
    skillState === 'dim' ? 'tl-skill-dim' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      style={{ ...style, '--c': color }}
      data-tlid={item.id}
      ref={(el) => setAnchor(item.id, el)}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`${item.title}. ${yearLabel(item)}.${hasAssociatedItems ? ` Contains ${associatedItems.length} associated projects.` : ''}`}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onLeave(item.id)}
      onFocus={() => onHover(item.id)}
      onBlur={() => onLeave(item.id)}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(item.id);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(item.id);
        }
      }}
    >
      {visualLevel <= 3 ? (
        <span className="tl-dot" aria-hidden="true" />
      ) : visualLevel === 4 ? (
        <div className="tl-title">{item.title}</div>
      ) : (
        <>
          <div className="tl-emp-head">
            <div className="tl-yrs">{yearLabel(item)}</div>
            <div className="tl-title">{item.title}</div>
            {item.role && <div className="tl-role">{item.role}</div>}
          </div>
          {hasAssociatedItems && !isActive && (
            <div className="tl-emp-pills" aria-hidden="true">
              {associatedItems.map((project) => (
                <span
                  key={project.id}
                  className="tl-emp-pill"
                  style={{ '--c': categories[project.category]?.color || color }}
                >
                  {project.title}
                </span>
              ))}
            </div>
          )}
          {hasAssociatedItems && isActive && (
            <div className="tl-emp-children">
              {associatedItems.map((project) => {
                const lvl = importance(project);
                const childOpen = activeChildId === project.id;
                const childSkillState = skillStateFor(project.id);
                return (
                  <div
                    key={project.id}
                    className={`tl-emp-child tl-emp-child-l${lvl >= 5 ? 5 : lvl === 4 ? 4 : 3}${childOpen ? ' is-open' : ''}${childSkillState === 'hit' ? ' tl-skill-hit' : ''}${childSkillState === 'dim' ? ' tl-skill-dim' : ''}`}
                    style={{ '--c': categories[project.category]?.color || color }}
                    data-tlid={project.id}
                    ref={(el) => setAnchor(project.id, el)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={childOpen}
                    aria-label={`${project.title}. ${yearLabel(project)}.`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleChild(project.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleChild(project.id);
                      }
                    }}
                  >
                    <div className="tl-emp-child-head">
                      <span className="tl-emp-child-title">{project.title}</span>
                      <small>{yearLabel(project)}</small>
                    </div>
                    {project.role && <div className="tl-emp-child-role">{project.role}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MobileBlock({ item, categories, style, isActive, associatedItems = [], skillState = null, setAnchor, onToggle }) {
  const color = categories[item.category]?.color || '#888';
  const isSideProject = item.category === 'project' && item.side;
  const visualLevel = isSideProject ? importance(item) : 5;
  const childCount = associatedItems.length;
  const cls = [
    'tl-block',
    `tl-${item.category}`,
    item.side ? 'tl-side' : '',
    isSideProject ? `tl-importance-${visualLevel}` : '',
    isSideProject && visualLevel <= 3 ? 'tl-dot-project' : '',
    isSideProject && visualLevel === 4 ? 'tl-named-project' : '',
    item.end == null ? 'tl-ongoing' : '',
    childCount > 0 ? 'tl-has-children' : '',
    isActive ? 'is-active' : '',
    skillState === 'hit' ? 'tl-skill-hit' : '',
    skillState === 'dim' ? 'tl-skill-dim' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      style={{ ...style, '--c': color }}
      data-tlid={item.id}
      ref={(el) => setAnchor(item.id, el)}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`${item.title}. ${yearLabel(item)}.${childCount > 0 ? ` Contains ${childCount} projects.` : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(item.id);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(item.id);
        }
      }}
    >
      {visualLevel <= 3 ? (
        <span className="tl-dot" aria-hidden="true" />
      ) : visualLevel === 4 ? (
        <div className="tl-title">{item.title}</div>
      ) : (
        <>
          <div className="tl-yrs">{yearLabel(item)}</div>
          <div className="tl-title">{item.title}</div>
          {item.role && <div className="tl-role">{item.role}</div>}
          {childCount > 0 && (
            <div className="tl-emp-pills" aria-hidden="true">
              {associatedItems.map((project) => (
                <span
                  key={project.id}
                  className="tl-emp-pill"
                  style={{ '--c': categories[project.category]?.color || color }}
                >
                  {project.title}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LaunchPreview({ items, categories }) {
  const tops = items.filter((i) => !i.parentId);
  if (!tops.length) return null;
  const min = Math.min(...tops.map((i) => i.start));
  const max = Math.max(...tops.map(endYear), NOW_YEAR);
  const span = Math.max(max - min, 1);
  const W = 88;
  const H = 34;
  const rowH = H / 3;
  const rows = { employment: 0, project: 1, education: 2 };
  return (
    <svg
      className="tl-launch-mini"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {tops.map((i) => {
        const row = rows[i.category];
        if (row == null) return null;
        const x = ((i.start - min) / span) * W;
        const w = Math.max(((endYear(i) - i.start) / span) * W, 2);
        return (
          <rect
            key={i.id}
            x={x}
            y={row * rowH + 2.5}
            width={w}
            height={rowH - 5}
            rx={1.5}
            fill={categories[i.category]?.color || '#888'}
            opacity={i.side ? 0.45 : 0.8}
          />
        );
      })}
    </svg>
  );
}

function Timeline({ data, isOpen, onOpen, onClose, activeSkill = null, onSkillChange }) {
  const [activeId, setActiveId] = useState(null);
  const [activeChildId, setActiveChildId] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobLane, setMobLane] = useState('employment');
  const scrollRef = useRef(null);
  const launchRef = useRef(null);
  const wasOpen = useRef(false);
  const anchors = useRef(new Map());

  const { categories = {}, items = [], title, subtitle, skillGroups = [] } = data;
  const itemsById = useMemo(() => Object.fromEntries(items.map((i) => [i.id, i])), [items]);

  const allSkills = useMemo(() => skillGroups.flatMap((g) => g.skills || []), [skillGroups]);
  const skillMatchIds = useMemo(() => {
    if (!activeSkill) return null;
    const ids = new Set();
    items.forEach((it) => {
      if ((it.skills || []).includes(activeSkill)) {
        ids.add(it.id);
        if (it.parentId) ids.add(it.parentId);
      }
    });
    return ids;
  }, [items, activeSkill]);
  const skillStateFor = (id) => (skillMatchIds ? (skillMatchIds.has(id) ? 'hit' : 'dim') : null);

  const { lanes, childrenByParent, minYear, maxYear, orderByStart, yearStarts, totalUnits, itemLayouts, laneRows } = useMemo(() => {
    const grouped = { employment: [], education: [], project: [] };
    const childGroups = {};
    const visibleItems = [];
    const itemOrder = {};

    items.forEach((it, index) => {
      itemOrder[it.id] = index;
      if (it.parentId) {
        (childGroups[it.parentId] = childGroups[it.parentId] || []).push(it);
      } else if (grouped[it.category]) {
        grouped[it.category].push(it);
        visibleItems.push(it);
      }
    });

    Object.values(childGroups).forEach((arr) => {
      arr.sort((a, b) => (
        a.start - b.start
        || monthOrder(a) - monthOrder(b)
        || endYear(a) - endYear(b)
        || itemOrder[a.id] - itemOrder[b.id]
      ));
    });

    const min = items.length ? Math.min(...items.map((i) => i.start)) : NOW_YEAR;
    const max = items.length ? Math.max(...items.map(endYear), NOW_YEAR) : NOW_YEAR;

    // within each lane, newest first (drives the mobile stacked order)
    Object.values(grouped).forEach((arr) => {
      arr.sort((a, b) => (
        endYear(b) - endYear(a)
        || b.start - a.start
        || monthOrder(b) - monthOrder(a)
        || itemOrder[b.id] - itemOrder[a.id]
      ));
    });

    const startGroups = {};
    visibleItems.filter(isMonthScaleItem).forEach((it) => {
      const key = `${it.category}:${it.start}`;
      (startGroups[key] = startGroups[key] || []).push(it);
    });

    const startsPerYear = {};
    Object.values(startGroups).forEach((group) => {
      const year = group[0].start;
      const units = group.reduce((sum, it) => sum + monthSlotUnits(it), 0);
      startsPerYear[year] = Math.max(startsPerYear[year] || 0, units);
    });

    const yearUnits = {};
    for (let y = min; y < max; y += 1) {
      yearUnits[y] = Math.max(MIN_YEAR_UNITS, startsPerYear[y] || MIN_YEAR_UNITS);
    }

    const starts = {};
    let cursor = 0;
    for (let y = min; y <= max; y += 1) {
      starts[y] = cursor;
      if (y < max) cursor += yearUnits[y] || MIN_YEAR_UNITS;
    }

    const slots = {};
    Object.values(startGroups).forEach((group) => {
      group.sort((a, b) => (
        monthOrder(a) - monthOrder(b)
        || (endYear(a) - a.start) - (endYear(b) - b.start)
        || itemOrder[a.id] - itemOrder[b.id]
      ));

      let offset = 0;
      group.forEach((it) => {
        const units = monthSlotUnits(it);
        slots[it.id] = {
          offset,
          pointWidth: units * POINT_BLOCK_RATIO,
        };
        offset += units;
      });
    });

    const total = Math.max(cursor + OPEN_RUNOFF, MIN_YEAR_UNITS);
    const getItemLayout = (item) => {
      const monthScale = isMonthScaleItem(item);
      const yUnits = yearUnits[item.start] || MIN_YEAR_UNITS;
      const startFrac = Number.isFinite(item.startMonth)
        ? ((item.startMonth - 1) / 12) * yUnits
        : 0;

      // month-range items (start and end month within one year) take their
      // true duration, so e.g. a Jan-Apr stint doesn't claim the whole year
      if (monthScale && Number.isFinite(item.endMonth) && item.endMonth > item.startMonth) {
        const startUnits = (starts[item.start] || 0) + startFrac;
        const widthUnits = Math.max(((item.endMonth - item.startMonth + 1) / 12) * yUnits, 0.3);
        return { startUnits, widthUnits, endUnits: startUnits + widthUnits };
      }

      const slot = monthScale
        ? slots[item.id] || { offset: 0, pointWidth: ITEM_SLOT_UNITS * POINT_BLOCK_RATIO }
        : { offset: 0, pointWidth: MIN_YEAR_UNITS };
      // year-scale items honor an optional startMonth, so a job that begins
      // mid-year starts after whatever preceded it instead of overlapping it
      const startUnits = (starts[item.start] || 0) + (monthScale ? slot.offset : startFrac);
      const ongoing = item.end == null;
      const endUnits = ongoing ? total : (starts[item.end] || starts[max] || startUnits);
      const widthUnits = ongoing
        ? total - startUnits
        : monthScale
          ? slot.pointWidth
          : Math.max(endUnits - startUnits, MIN_YEAR_UNITS);

      return {
        startUnits,
        widthUnits,
        endUnits: startUnits + widthUnits,
      };
    };

    const layouts = {};
    const rowsByLane = {};
    Object.entries(grouped).forEach(([cat, laneItems]) => {
      const rowEnds = [];
      const positioned = laneItems
        .map((item) => ({ item, ...getItemLayout(item) }))
        .sort((a, b) => (
          a.startUnits - b.startUnits
          || a.endUnits - b.endUnits
          || itemOrder[a.item.id] - itemOrder[b.item.id]
        ));

      positioned.forEach(({ item, ...layout }) => {
        let row = 0;
        while (rowEnds[row] != null && layout.startUnits < rowEnds[row] - 0.01) row += 1;
        rowEnds[row] = layout.endUnits;
        layouts[item.id] = { ...layout, row };
      });

      rowsByLane[cat] = Math.max(rowEnds.length, 1);
    });

    // left-to-right reveal order keyed by start year
    const order = {};
    [...visibleItems]
      .sort((a, b) => (
        a.start - b.start
        || monthOrder(a) - monthOrder(b)
        || itemOrder[a.id] - itemOrder[b.id]
      ))
      .forEach((it, idx) => { order[it.id] = idx; });

    return {
      lanes: grouped,
      childrenByParent: childGroups,
      minYear: min,
      maxYear: max,
      orderByStart: order,
      yearStarts: starts,
      totalUnits: total,
      itemLayouts: layouts,
      laneRows: rowsByLane,
    };
  }, [items]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (activeSkill) onSkillChange(null);
        else close();
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, activeSkill]);

  // return focus to the launch card when the overlay closes
  useEffect(() => {
    if (wasOpen.current && !isOpen) launchRef.current?.focus();
    wasOpen.current = isOpen;
  }, [isOpen]);

  // track viewport so the timeline can swap to its vertical mobile layout
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(MOBILE_MQ);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // desktop opens scrolled to the present (right) end of the horizontal track;
  // the vertical mobile layout already puts 'now' at the top, so it stays at scrollTop 0
  useEffect(() => {
    if (!isOpen || isMobile) return undefined;
    const el = scrollRef.current;
    if (!el) return undefined;
    const id = requestAnimationFrame(() => {
      el.scrollLeft = el.scrollWidth;
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen, isMobile]);

  useEffect(() => {
    setActiveChildId(null);
  }, [activeId]);

  const close = () => {
    onClose();
    setActiveId(null);
    setActiveChildId(null);
    setHoverId(null);
    setMobLane('employment');
  };
  // Track only expansions, not collapses. Kept outside the state updater so
  // the updater stays pure (StrictMode double-invokes it in dev).
  const toggle = (id) => {
    if (activeId !== id) track('timeline-item', { item: id });
    setActiveId((cur) => (cur === id ? null : id));
  };
  const toggleChild = (id) => setActiveChildId((cur) => (cur === id ? null : id));
  const setAnchor = (id, el) => { if (el) anchors.current.set(id, el); else anchors.current.delete(id); };
  const onHover = (id) => setHoverId(id);
  const onLeave = (id) => setHoverId((cur) => (cur === id ? null : cur));

  const xPct = (year) => ((yearStarts[year] || 0) / totalUnits) * 100;
  const unitPct = (units) => (units / totalUnits) * 100;
  const years = [];
  for (let y = minYear; y <= maxYear; y += 1) years.push(y);
  const trackWidth = totalUnits * PX_PER_UNIT;
  const childrenOf = (id) => childrenByParent[id] || [];
  const isParent = (it) => childrenOf(it.id).length > 0;
  const laneBase = (cat) => LANE_BASE_HEIGHT[cat] || 66;
  const laneHeight = (cat) => {
    const rows = laneRows[cat] || 1;
    return rows * laneBase(cat) + (rows - 1) * LANE_ROW_GAP;
  };
  const blockTop = (cat, row) => row * (laneBase(cat) + LANE_ROW_GAP);
  const activeItem = activeId ? itemsById[activeId] : null;
  const activeIsParent = Boolean(activeItem && childrenByParent[activeId]?.length);
  const pinnedId = activeChildId || (activeId && !activeIsParent ? activeId : null);
  let popId = pinnedId;
  if (!popId && hoverId && !(hoverId === activeId && activeIsParent)) popId = hoverId;
  const popItem = popId ? itemsById[popId] : null;
  const popAnchor = popId ? anchors.current.get(popId) : null;

  // ----- vertical mobile layout: time runs top (now) -> bottom (oldest) -----
  // accordion of lanes: one expanded lane dominates, the others collapse to
  // slim, textless time-rails that can be tapped to swap.
  const canvasHeight = totalUnits * V_PX_PER_UNIT;
  const vTop = (endUnits) => (totalUnits - endUnits) * V_PX_PER_UNIT;
  const vHeight = (widthUnits) => widthUnits * V_PX_PER_UNIT;
  const mobLayout = (item) => itemLayouts[item.id] || {
    startUnits: yearStarts[item.start] || 0,
    widthUnits: ITEM_SLOT_UNITS,
    endUnits: (yearStarts[item.start] || 0) + ITEM_SLOT_UNITS,
    row: 0,
  };
  // pack overlapping spanning blocks into side-by-side columns, per lane
  // (dots and named chips float on the right edge instead of claiming a column)
  const mobRows = {};
  LANE_ORDER.forEach((cat) => {
    const spans = (lanes[cat] || []).filter((it) => !(it.category === 'project' && it.side && importance(it) <= 4));
    const rowEnds = [];
    const rowOf = {};
    spans
      .map((it) => ({ it, l: mobLayout(it) }))
      .sort((a, b) => a.l.startUnits - b.l.startUnits || a.l.endUnits - b.l.endUnits)
      .forEach(({ it, l }) => {
        let r = 0;
        while (rowEnds[r] != null && l.startUnits < rowEnds[r] - 0.01) r += 1;
        rowEnds[r] = l.endUnits;
        rowOf[it.id] = r;
      });
    mobRows[cat] = { rowOf, count: Math.max(rowEnds.length, 1) };
  });

  const mobBlockStyle = (item) => {
    const layout = mobLayout(item);
    const isSideProject = item.category === 'project' && item.side;
    const visualLevel = isSideProject ? importance(item) : 5;
    const style = { top: `${vTop(layout.endUnits)}px`, '--i': orderByStart[item.id] };
    if (visualLevel === 5) {
      style.height = `${Math.max(vHeight(layout.widthUnits), 58)}px`;
      const { rowOf, count } = mobRows[item.category] || { rowOf: {}, count: 1 };
      const r = rowOf[item.id] || 0;
      if (count > 1) {
        style.left = `calc(${(r * 100) / count}% + ${r ? 4 : 0}px)`;
        style.width = `calc(${100 / count}% - ${r ? 4 : 0}px)`;
        style.right = 'auto';
      }
      style.zIndex = 2 + r;
    }
    return style;
  };

  // time-positioned child dots shown inside a collapsed parent's rail bar;
  // same-year children fan downward so they don't pile on one spot
  const kidMinis = (parent) => {
    const seen = {};
    return childrenOf(parent.id).map((k) => {
      const n = (seen[k.start] = (seen[k.start] || 0) + 1) - 1;
      return { kid: k, top: vTop(mobLayout(k).endUnits) + n * 9 };
    });
  };
  const switchMobLane = (cat) => {
    setMobLane(cat);
    setActiveId(null);
    setActiveChildId(null);
  };

  // horizontal swipe in the mobile canvas moves between lanes;
  // mostly-vertical drags are left alone so time-scrolling still works
  const touchStart = useRef(null);
  const onLaneTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onLaneTouchEnd = (e) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    const idx = LANE_ORDER.indexOf(mobLane);
    const next = dx < 0
      ? Math.min(idx + 1, LANE_ORDER.length - 1)
      : Math.max(idx - 1, 0);
    if (LANE_ORDER[next] !== mobLane) switchMobLane(LANE_ORDER[next]);
  };
  const mobPanelTop = activeItem ? vTop(mobLayout(activeItem).endUnits) : 0;

  return (
    <section className="timeline-launch" aria-labelledby="timeline-heading">
      <h3 id="timeline-heading">Timeline</h3>
      <button
        type="button"
        className="tl-launch-card"
        onClick={onOpen}
        ref={launchRef}
        aria-label="Open career timeline"
      >
        <LaunchPreview items={items} categories={categories} />
        <span className="tl-launch-arrow" aria-hidden="true">&rsaquo;</span>
      </button>

      {isOpen && createPortal((
        <div className="tl-overlay" role="presentation" onClick={close}>
          <div
            className="tl-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Timeline'}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="tl-head">
              <div className="tl-head-text">
                <h2>{title || 'Timeline'}</h2>
                {subtitle && <p>{subtitle}</p>}
              </div>
              <button type="button" className="tl-close" onClick={close} aria-label="Close timeline">
                &times;
              </button>
            </header>

            {allSkills.length > 0 && (
              <div className="tl-skillbar" role="toolbar" aria-label="Highlight a skill">
                {allSkills.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`tl-skill-chip${activeSkill === s ? ' is-on' : ''}`}
                    aria-pressed={activeSkill === s}
                    onClick={() => onSkillChange(activeSkill === s ? null : s)}
                  >
                    {s}
                  </button>
                ))}
                <button
                  type="button"
                  className="tl-skill-clear"
                  onClick={() => onSkillChange(null)}
                  disabled={!activeSkill}
                >
                  Clear
                </button>
              </div>
            )}

            {!isMobile && (
            <div className="tl-body">
              <div className="tl-gutter" aria-hidden="true">
                <div className="tl-gutter-axis" />
                {LANE_ORDER.map((cat) => (
                  <div
                    key={cat}
                    className={`tl-gutter-lane tl-gh-${cat}`}
                    style={{ '--c': categories[cat]?.color, height: `${laneHeight(cat)}px` }}
                  >
                    {categories[cat]?.label}
                  </div>
                ))}
              </div>

              <div className="tl-scroll" ref={scrollRef}>
                <div
                  className="tl-canvas"
                  style={{ width: `${trackWidth}px` }}
                  onClick={() => { setActiveId(null); setActiveChildId(null); }}
                >
                  <div className="tl-axis-h" aria-hidden="true">
                    {years.map((y) => {
                      const t = y === minYear ? 'translateX(0)' : y === maxYear ? 'translateX(-100%)' : 'translateX(-50%)';
                      return (
                        <span key={y} className="tl-xtick" style={{ left: `${xPct(y)}%`, transform: t }}>
                          {y === maxYear ? 'now' : y}
                        </span>
                      );
                    })}
                  </div>

                  <div className="tl-lanes">
                    <div className="tl-grid">
                      {years.map((y) => (
                        <span key={y} className="tl-gridline" style={{ left: `${xPct(y)}%` }} />
                      ))}
                    </div>

                    {LANE_ORDER.map((cat) => (
                      <div
                        key={cat}
                        className={`tl-lane tl-lane-${cat}`}
                        style={{ '--lc': categories[cat]?.color, height: `${laneHeight(cat)}px` }}
                      >
                        <span className="tl-lane-heading">{categories[cat]?.label}</span>
                        {lanes[cat].map((item) => {
                          const layout = itemLayouts[item.id] || {
                            startUnits: yearStarts[item.start] || 0,
                            widthUnits: ITEM_SLOT_UNITS,
                            row: 0,
                          };
                          const visualLevel = item.category === 'project' && item.side ? importance(item) : 5;
                          const itemIsParent = isParent(item);
                          const expanded = itemIsParent && activeId === item.id;
                          const blockHeight = expanded
                            ? expandedParentHeight(childrenOf(item.id))
                            : itemIsParent ? laneBase(cat)
                            : visualLevel <= 2 ? 14 : visualLevel === 3 ? 12 : visualLevel === 4 ? 34 : laneBase(cat);
                          const rowTop = blockTop(cat, layout.row || 0);
                          const expandsUp = expanded && cat === 'education';
                          const topPx = expanded
                            ? (expandsUp ? rowTop + laneBase(cat) - blockHeight : rowTop)
                            : rowTop + (itemIsParent ? 0 : Math.max(0, (laneBase(cat) - blockHeight) / 2));
                          const startUnits = layout.startUnits;
                          const ongoing = item.end == null;
                          const widthUnits = layout.widthUnits;
                          const left = unitPct(startUnits);
                          const width = unitPct(widthUnits);
                          const solid = ongoing
                            ? Math.max(0, Math.min(100, (((yearStarts[maxYear] || 0) - startUnits) / Math.max(totalUnits - startUnits, 1)) * 100))
                            : 100;
                          const style = {
                            left: `${left}%`,
                            top: `${topPx}px`,
                            width: `${width}%`,
                            height: `${blockHeight}px`,
                            '--i': orderByStart[item.id],
                            '--solid': `${solid}%`,
                          };
                          return (
                            <Block
                              key={item.id}
                              item={item}
                              categories={categories}
                              style={style}
                              associatedItems={childrenByParent[item.id] || []}
                              isActive={activeId === item.id}
                              activeChildId={activeChildId}
                              skillStateFor={skillStateFor}
                              setAnchor={setAnchor}
                              onHover={onHover}
                              onLeave={onLeave}
                              onToggle={toggle}
                              onToggleChild={toggleChild}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}

            {isMobile && (
            <div className="tl-body tl-mob-body">
              <div className="tl-mob-cols">
                {LANE_ORDER.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`tl-mob-col${mobLane === cat ? ' is-open' : ''}`}
                    style={{ '--c': categories[cat]?.color }}
                    aria-pressed={mobLane === cat}
                    onClick={() => switchMobLane(cat)}
                  >
                    {categories[cat]?.label}
                  </button>
                ))}
              </div>

              <div
                className="tl-mob-scroll"
                ref={scrollRef}
                onTouchStart={onLaneTouchStart}
                onTouchEnd={onLaneTouchEnd}
              >
                <div
                  className="tl-mob-canvas"
                  style={{ height: `${canvasHeight}px` }}
                  onClick={() => { setActiveId(null); setActiveChildId(null); }}
                >
                  {years.map((y) => (
                    <span key={y} className="tl-mob-tick" style={{ top: `${vTop(yearStarts[y] || 0)}px` }}>
                      {y === maxYear ? 'now' : y}
                    </span>
                  ))}

                  <div className="tl-mob-rails">
                    {LANE_ORDER.map((cat) => {
                      const open = mobLane === cat;
                      return (
                        <div
                          key={cat}
                          className={`tl-mob-rail${open ? ' is-open' : ''}`}
                          style={{ '--c': categories[cat]?.color }}
                          role={open ? undefined : 'button'}
                          tabIndex={open ? undefined : 0}
                          aria-label={open ? undefined : `Show ${categories[cat]?.label}`}
                          onClick={open ? undefined : (e) => { e.stopPropagation(); switchMobLane(cat); }}
                          onKeyDown={open ? undefined : (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              switchMobLane(cat);
                            }
                          }}
                        >
                          {open
                            ? lanes[cat].map((item) => (
                              <MobileBlock
                                key={item.id}
                                item={item}
                                categories={categories}
                                style={mobBlockStyle(item)}
                                isActive={activeId === item.id}
                                associatedItems={childrenOf(item.id)}
                                skillState={skillStateFor(item.id)}
                                setAnchor={setAnchor}
                                onToggle={toggle}
                              />
                            ))
                            : lanes[cat].map((item) => {
                              const layout = mobLayout(item);
                              const isSideProject = item.category === 'project' && item.side;
                              const isDot = isSideProject && importance(item) <= 4;
                              const miniSkill = skillStateFor(item.id);
                              const { rowOf, count } = mobRows[cat] || { rowOf: {}, count: 1 };
                              const r = rowOf[item.id] || 0;
                              const cls = [
                                'tl-mob-mini',
                                isDot ? 'tl-mob-mini-dot' : '',
                                miniSkill === 'hit' ? 'tl-skill-hit' : '',
                                miniSkill === 'dim' ? 'tl-skill-dim' : '',
                              ].filter(Boolean).join(' ');
                              const miniStyle = isDot
                                ? { top: `${vTop(layout.endUnits)}px` }
                                : {
                                  top: `${vTop(layout.endUnits)}px`,
                                  height: `${Math.max(vHeight(layout.widthUnits), 14)}px`,
                                  ...(count > 1
                                    ? { left: `${4 + r * 8}px`, right: 'auto', width: '7px' }
                                    : {}),
                                };
                              return (
                                <React.Fragment key={item.id}>
                                  <span className={cls} style={miniStyle} aria-hidden="true" />
                                  {kidMinis(item).map(({ kid, top }) => {
                                    const kSkill = skillStateFor(kid.id);
                                    const kCls = [
                                      'tl-mob-mini-kid',
                                      kSkill === 'hit' ? 'tl-skill-hit' : '',
                                      kSkill === 'dim' ? 'tl-skill-dim' : '',
                                    ].filter(Boolean).join(' ');
                                    return (
                                      <span
                                        key={kid.id}
                                        className={kCls}
                                        style={{ top: `${top}px`, '--c': categories[kid.category]?.color }}
                                        aria-hidden="true"
                                      />
                                    );
                                  })}
                                </React.Fragment>
                              );
                            })}
                        </div>
                      );
                    })}
                  </div>

                  {activeItem && (
                    <div
                      className={`tl-mob-card tl-${activeItem.category}`}
                      style={{ top: `${mobPanelTop}px`, '--c': categories[activeItem.category]?.color }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="tl-mob-card-close"
                        onClick={() => { setActiveId(null); setActiveChildId(null); }}
                        aria-label="Close details"
                      >
                        &times;
                      </button>
                      <div className="tl-mob-card-yrs">{yearLabel(activeItem)}</div>
                      <div className="tl-mob-card-title">{activeItem.title}</div>
                      {activeItem.role && <div className="tl-mob-card-role">{activeItem.role}</div>}
                      {activeItem.location && <div className="tl-mob-card-loc">{activeItem.location}</div>}
                      {activeItem.summary && <p className="tl-mob-card-summary">{activeItem.summary}</p>}
                      <ProjectLinks links={activeItem.links} />

                      {childrenOf(activeId).length > 0 && (
                        <div className="tl-mob-card-children">
                          <div className="tl-mob-card-children-head">Projects</div>
                          {childrenOf(activeId).map((project) => {
                            const childOpen = activeChildId === project.id;
                            return (
                              <div
                                key={project.id}
                                className={`tl-emp-child${childOpen ? ' is-open' : ''}`}
                                style={{ '--c': categories[project.category]?.color }}
                                role="button"
                                tabIndex={0}
                                aria-expanded={childOpen}
                                aria-label={`${project.title}. ${yearLabel(project)}.`}
                                onClick={(e) => { e.stopPropagation(); toggleChild(project.id); }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleChild(project.id);
                                  }
                                }}
                              >
                                <div className="tl-emp-child-head">
                                  <span className="tl-emp-child-title">{project.title}</span>
                                  <small>{yearLabel(project)}</small>
                                </div>
                                {project.role && <div className="tl-mob-child-role">{project.role}</div>}
                                {childOpen && (project.summary || (project.links && project.links.length > 0)) && (
                                  <div className="tl-mob-child-detail">
                                    {project.summary && <p>{project.summary}</p>}
                                    <ProjectLinks links={project.links} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      ), document.body)}

      {isOpen && !isMobile && popItem && (
        <DetailPopover item={popItem} anchorEl={popAnchor} accent={categories[popItem.category]?.color} />
      )}
    </section>
  );
}

export default Timeline;
