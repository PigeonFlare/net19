(() => {
  const theme = globalThis.net19Theme;
  if (!theme || globalThis.net19FitStarted || window.top !== window) return;
  globalThis.net19FitStarted = true;
  const root = document.documentElement;
  const SAFE = 'data-n19-safe';
  const REPORT = 'data-n19-fit';
  const STORE = 'net19-fit';
  const MAX_SECTIONS = 200;
  const FITS_TO_RECOVER = 2;
  const storage = globalThis.chrome?.storage?.local;

  const section = () => {
    const first = location.pathname.split('/')[1] || '';
    return `${location.hostname.replace(/^www\./, '')}/${/^[a-z][a-z-]{0,23}$/i.test(first) ? first.toLowerCase() : '*'}`;
  };
  const records = () => storage ? storage.get(STORE).then(stored => stored[STORE] || {}, () => ({})) : Promise.resolve({});
  let writes = Promise.resolve();
  const remember = (key, record) => {
    if (!storage) return;
    writes = writes.then(async () => {
      const all = await records();
      if (record.safe) all[key] = record; else if (key in all) delete all[key]; else return;
      const keys = Object.keys(all);
      for (const old of keys.slice(0, Math.max(0, keys.length - MAX_SECTIONS))) delete all[old];
      await storage.set({ [STORE]: all });
    }).catch(() => {});
  };
  let current = { key: section(), record: { safe: false, fits: 0 } };
  const recall = () => {
    const key = section();
    return records().then(all => {
      current = { key, record: all[key] || { safe: false, fits: 0 } };
      if (current.record.safe) root.setAttribute(SAFE, '');
    });
  };

  const PROBE = 'a[href],button,input:not([type=hidden]),textarea,select,img,video,h1,h2,h3,[role=button],[role=link]';
  const MAX_PROBED = 1500;
  const measure = () => {
    const width = innerWidth, height = innerHeight;
    const found = document.querySelectorAll(PROBE);
    const stride = Math.max(1, Math.ceil(found.length / MAX_PROBED));
    let shown = 0, onScreen = 0;
    for (let i = 0; i < found.length; i += stride) {
      const el = found[i];
      if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
      const box = el.getBoundingClientRect();
      const minimum = el.tagName === 'IMG' || el.tagName === 'VIDEO' ? 32 : 2;
      if (box.width < minimum || box.height < minimum) continue;
      shown += stride;
      if (box.bottom > 0 && box.top < height && box.right > 0 && box.left < width) onScreen += stride;
    }
    return { shown, onScreen, wide: (document.scrollingElement || root).scrollWidth > width * 1.25 };
  };
  const DEFAULT_FLOOR = .6;
  const floorHere = () => {
    const floor = typeof theme.fitFloor === 'function' ? theme.fitFloor() : theme.fitFloor;
    return typeof floor === 'number' ? floor : DEFAULT_FLOOR;
  };
  const MIN_SHOWN = 12;
  const verdict = (full, safe) => {
    const floor = floorHere();
    if (safe.shown < MIN_SHOWN) return 'unsure';
    if (full.shown < safe.shown * floor) return 'unfit';
    if (safe.onScreen >= 10 && full.onScreen < safe.onScreen * floor * .4) return 'unfit';
    return full.wide && !safe.wide ? 'unfit' : 'fit';
  };

  const scrollPositions = () => {
    const moved = [];
    const page = document.scrollingElement || root;
    if (page.scrollTop || page.scrollLeft) moved.push([page, page.scrollTop, page.scrollLeft]);
    for (const el of document.body?.getElementsByTagName('*') || []) if (el.scrollTop || el.scrollLeft) moved.push([el, el.scrollTop, el.scrollLeft]);
    return moved;
  };
  const compare = () => {
    const moved = scrollPositions();
    const wasSafe = root.hasAttribute(SAFE);
    root.removeAttribute(SAFE);
    const full = measure();
    root.setAttribute(SAFE, '');
    const safe = measure();
    if (!wasSafe) root.removeAttribute(SAFE);
    for (const [el, top, left] of moved) { el.scrollTop = top; el.scrollLeft = left; }
    return { full, safe, result: verdict(full, safe) };
  };

  const judge = () => {
    if (!document.body || document.visibilityState === 'hidden') return;
    const started = performance.now();
    const { full, safe, result } = compare();
    root.setAttribute(REPORT, `${result} ${full.shown}/${safe.shown} ${full.onScreen}/${safe.onScreen}${full.wide && !safe.wide ? ' wide' : ''} ${Math.round(performance.now() - started)}ms`);
    const { key, record } = current;
    if (result === 'unfit') {
      root.setAttribute(SAFE, '');
      current.record = { safe: true, fits: 0 };
      remember(key, current.record);
    } else if (result === 'fit' && record.safe) {
      const fitsInARow = record.fits + 1;
      current.record = fitsInARow >= FITS_TO_RECOVER ? { safe: false, fits: 0 } : { safe: true, fits: fitsInARow };
      remember(key, current.record);
    }
  };

  const SETTLE_MS = 2500;
  const MIN_GAP_MS = 5000;
  let timer = 0, lastJudged = 0;
  const schedule = delay => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const idle = globalThis.requestIdleCallback || (run => setTimeout(run, 0));
      idle(() => {
        if (Date.now() - lastJudged < MIN_GAP_MS) return schedule(MIN_GAP_MS);
        lastJudged = Date.now();
        judge();
      }, { timeout: 2000 });
    }, delay);
  };
  const ready = recall();
  const start = () => ready.then(() => schedule(SETTLE_MS));
  if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && !root.hasAttribute(REPORT)) start(); });
  globalThis.navigation?.addEventListener?.('navigatesuccess', () => {
    if (section() === current.key) return schedule(SETTLE_MS);
    if (current.record.safe) root.removeAttribute(SAFE);
    recall().then(() => schedule(SETTLE_MS));
  });
  document.addEventListener('net19-fit-check', () => { lastJudged = Date.now(); ready.then(judge); });
})();
