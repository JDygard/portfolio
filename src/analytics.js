// Provider-agnostic analytics shim.
//
// Nothing here runs unless VITE_ANALYTICS_PROVIDER is set at build time, so
// `npm start` and the SSR/prerender pass stay completely inert. Swapping
// vendors is an env-var change, not a code change — see ANALYTICS.md.
//
// Everything is guarded for SSR: this module is pulled into the server bundle
// via the component tree, so it must never touch `window` at module scope.

const env = import.meta.env;

const cfg = {
  provider: env.VITE_ANALYTICS_PROVIDER || '',
  umamiId: env.VITE_UMAMI_WEBSITE_ID || '',
  umamiSrc: env.VITE_UMAMI_SRC || 'https://cloud.umami.is/script.js',
  plausibleDomain: env.VITE_PLAUSIBLE_DOMAIN || '',
  plausibleSrc: env.VITE_PLAUSIBLE_SRC || 'https://plausible.io/js/script.outbound-links.tagged-events.js',
};

const enabled = () =>
  (cfg.provider === 'umami' && !!cfg.umamiId) ||
  (cfg.provider === 'plausible' && !!cfg.plausibleDomain);

let queue = [];
let started = false;

function deliver(name, props) {
  if (typeof window === 'undefined') return false;
  if (cfg.provider === 'umami' && window.umami && window.umami.track) {
    window.umami.track(name, props);
    return true;
  }
  if (cfg.provider === 'plausible' && window.plausible) {
    window.plausible(name, props ? { props } : undefined);
    return true;
  }
  return false;
}

function flush() {
  if (!queue.length) return;
  const pending = queue;
  queue = [];
  pending.forEach(([name, props]) => {
    if (!deliver(name, props)) queue.push([name, props]);
  });
}

/**
 * Record a named event. Safe to call anywhere, at any time — before the vendor
 * script has loaded, during SSR, or with analytics switched off entirely.
 */
export function track(name, props) {
  if (typeof window === 'undefined') return;
  if (env.DEV) console.debug('[analytics]', name, props || '');
  if (!enabled()) return;
  if (!deliver(name, props)) queue.push([name, props]);
}

/**
 * Fire-and-forget click handler factory for links that leave the site.
 * Returns undefined when analytics is off so React skips the listener.
 */
export function trackClick(name, props) {
  return () => track(name, props);
}

// --- Engagement: how long they actually stay, and how far they get ----------
//
// Dwell is measured in *visible* time (a backgrounded tab doesn't count) and
// reported at milestones rather than on unload — unload beacons are lossy on
// mobile Safari, milestone events are not. Each bucket is its own event name
// so it shows up as a discrete line in any vendor's dashboard.

const DWELL_BUCKETS = [10, 30, 60, 180, 600];
const SCROLL_BUCKETS = [50, 90];

function startEngagement() {
  let visibleMs = 0;
  let lastTick = Date.now();
  let dwellIdx = 0;
  let scrollIdx = 0;

  const tick = () => {
    const now = Date.now();
    if (document.visibilityState === 'visible') visibleMs += now - lastTick;
    lastTick = now;

    while (dwellIdx < DWELL_BUCKETS.length && visibleMs >= DWELL_BUCKETS[dwellIdx] * 1000) {
      track(`dwell-${DWELL_BUCKETS[dwellIdx]}s`);
      dwellIdx += 1;
    }
    if (dwellIdx >= DWELL_BUCKETS.length) clearInterval(timer);
  };

  const timer = setInterval(tick, 2000);
  document.addEventListener('visibilitychange', tick);

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = ((window.scrollY || doc.scrollTop) / scrollable) * 100;
    while (scrollIdx < SCROLL_BUCKETS.length && pct >= SCROLL_BUCKETS[scrollIdx]) {
      track(`scroll-${SCROLL_BUCKETS[scrollIdx]}`);
      scrollIdx += 1;
    }
    if (scrollIdx >= SCROLL_BUCKETS.length) window.removeEventListener('scroll', onScroll);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Injects the vendor script and starts engagement tracking. Called once from
 * the client entry point; a no-op when analytics is unconfigured.
 */
export function initAnalytics() {
  if (typeof window === 'undefined' || started || !enabled()) return;
  started = true;

  const s = document.createElement('script');
  s.defer = true;

  if (cfg.provider === 'umami') {
    s.src = cfg.umamiSrc;
    s.setAttribute('data-website-id', cfg.umamiId);
  } else {
    s.src = cfg.plausibleSrc;
    s.setAttribute('data-domain', cfg.plausibleDomain);
    // Plausible's own stub queues calls made before the script finishes.
    window.plausible =
      window.plausible ||
      function stub() {
        (window.plausible.q = window.plausible.q || []).push(arguments);
      };
  }

  s.addEventListener('load', flush);
  document.head.appendChild(s);

  // Belt and braces: if the vendor script is blocked, the queue simply never
  // drains — but if it loads late without firing `load` (cached edge cases),
  // this catches it.
  const retry = setInterval(() => {
    flush();
    if (!queue.length) clearInterval(retry);
  }, 1000);
  setTimeout(() => clearInterval(retry), 15000);

  startEngagement();
}
