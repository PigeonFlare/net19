(() => {
  if (globalThis.net19WatchingStyles) return;
  globalThis.net19WatchingStyles = true;
  let timer = 0;
  const changed = () => {
    if (timer) return;
    timer = setTimeout(() => { timer = 0; document.dispatchEvent(new Event('net19-css')); }, 150);
  };
  const proto = CSSStyleSheet.prototype;
  for (const name of ['insertRule', 'deleteRule', 'replace', 'replaceSync', 'addRule', 'removeRule']) {
    const original = proto[name];
    if (typeof original !== 'function') continue;
    Object.defineProperty(proto, name, { configurable: true, writable: true, value: { [name](...args) { const result = original.apply(this, args); changed(); return result; } }[name] });
  }
})();
