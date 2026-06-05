import React, { useEffect, useMemo, useRef, useState } from 'react';
import timelineData from '../data/timeline.json';
import './Timeline.css';

const NOW_YEAR = new Date().getFullYear();
const PX_PER_UNIT = 150; // desktop horizontal scale for one quiet year
const OPEN_RUNOFF = 1.4; // years of track past 'now' for ongoing items to run off & fade
const MIN_YEAR_UNITS = 1;
const ITEM_SLOT_UNITS = 0.9;
const POINT_BLOCK_RATIO = 0.78;
const SIDE_PROJECT_UNITS = { 1: 0.16, 2: 0.2, 3: 0.26, 4: 0.45, 5: 0.6 };
const LANE_BASE_HEIGHT = { employment: 88, project: 66, education: 72 };
const LANE_ROW_GAP = 10;
const LANE_ORDER = ['employment', 'project', 'education'];
const MONTH_LABELS = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const endYear = (item) => (item.end == null ? NOW_YEAR : item.end);
const monthOrder = (item) => (Number.isFinite(item.startMonth) ? item.startMonth : 13);
const isMonthScaleItem = (item) => item.end === item.start && Number.isFinite(item.startMonth);
const importance = (item) => Math.max(1, Math.min(5, Number.isFinite(item.importance) ? item.importance : 5));
const monthSlotUnits = (item) => (item.side ? SIDE_PROJECT_UNITS[importance(item)] : ITEM_SLOT_UNITS);

const PARENT_HEADER_H = 46; // employer header (years/title/role) atop the expanded overlay
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
        <a key={l.url} href={l.url} target="_blank" rel="noreferrer noopener" onClick={(e) => e.stopPropagation()}>
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

function Block({ item, categories, style, tipSide, tipUp, associatedItems, isActive, activeChildId, childTipLeft, onToggle, onToggleChild }) {
  const color = categories[item.category]?.color || '#888';
  const isSideProject = item.category === 'project' && item.side;
  const visualLevel = isSideProject ? importance(item) : 5;
  const hasAssociatedItems = associatedItems && associatedItems.length > 0;
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
    tipSide === 'right' ? 'tl-r' : '',
    childTipLeft ? 'tl-ctl' : '',
    isActive ? 'is-active' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      style={{ ...style, '--c': color }}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`${item.title}. ${yearLabel(item)}.${hasAssociatedItems ? ` Contains ${associatedItems.length} associated projects.` : ''}`}
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
                return (
                  <div
                    key={project.id}
                    className={`tl-emp-child tl-emp-child-l${lvl >= 5 ? 5 : lvl === 4 ? 4 : 3}${childOpen ? ' is-open' : ''}`}
                    style={{ '--c': categories[project.category]?.color || color }}
                    role="button"
                    tabIndex={isActive ? 0 : -1}
                    aria-expanded={childOpen}
                    aria-label={`${project.title}. ${yearLabel(project)}.`}
                    onClick={(e) => {
                      if (!isActive) return;
                      e.stopPropagation();
                      onToggleChild(project.id);
                    }}
                    onKeyDown={(e) => {
                      if (isActive && (e.key === 'Enter' || e.key === ' ')) {
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
                    <Tip item={project} side={childTipLeft ? 'right' : 'left'} showTitle />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      <Tip item={item} side={tipSide} up={tipUp} showTitle={visualLevel <= 3} />
    </div>
  );
}

function Timeline({ data = timelineData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeChildId, setActiveChildId] = useState(null);
  const scrollRef = useRef(null);

  const { categories = {}, items = [], title, subtitle } = data;

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
      const slot = monthScale
        ? slots[item.id] || { offset: 0, pointWidth: ITEM_SLOT_UNITS * POINT_BLOCK_RATIO }
        : { offset: 0, pointWidth: MIN_YEAR_UNITS };
      const startUnits = (starts[item.start] || 0) + slot.offset;
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
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // open scrolled to the present (right) end of the track
  useEffect(() => {
    if (!isOpen) return undefined;
    const el = scrollRef.current;
    if (!el) return undefined;
    const id = requestAnimationFrame(() => {
      el.scrollLeft = el.scrollWidth;
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  useEffect(() => {
    setActiveChildId(null);
  }, [activeId]);

  const close = () => {
    setIsOpen(false);
    setActiveId(null);
    setActiveChildId(null);
  };
  const toggle = (id) => setActiveId((cur) => (cur === id ? null : id));
  const toggleChild = (id) => setActiveChildId((cur) => (cur === id ? null : id));

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

  return (
    <section className="timeline-launch" data-tween-id="skills" aria-labelledby="timeline-heading">
      <h3 id="timeline-heading">Timeline</h3>
      <button type="button" className="button" onClick={() => setIsOpen(true)}>
        <span className="tl-launch-text">
          <span className="tl-launch-title">Career Timeline</span>
        </span>
      </button>

      {isOpen && (
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
                          const tipSide = ongoing ? 'left' : left + width / 2 > 55 ? 'right' : 'left';
                          const tipUp = cat === 'project';
                          const childTipLeft = ongoing || left + width / 2 > 50;
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
                              tipSide={tipSide}
                              tipUp={tipUp}
                              associatedItems={childrenByParent[item.id] || []}
                              isActive={activeId === item.id}
                              activeChildId={activeChildId}
                              childTipLeft={childTipLeft}
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
          </div>
        </div>
      )}
    </section>
  );
}

export default Timeline;
