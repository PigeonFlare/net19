const cache = new Map();
let pen = null;

export const rgba = color => {
  color = String(color);
  if (/^rgba?\(/.test(color)) { const m = color.match(/[\d.]+/g); return m && m.length >= 3 ? [+m[0], +m[1], +m[2], m.length > 3 ? +m[3] : 1] : null; }
  if (!/^(?:color|oklab|oklch|lab|lch|hsla?|hwb)\(/.test(color)) return null;
  if (cache.has(color)) return cache.get(color);
  let out = null;
  try {
    pen ||= new OffscreenCanvas(1, 1).getContext('2d', { willReadFrequently: true });
    pen.clearRect(0, 0, 1, 1); pen.fillStyle = color; pen.fillRect(0, 0, 1, 1);
    const d = pen.getImageData(0, 0, 1, 1).data;
    out = d[3] ? [Math.round(d[0] * 255 / d[3]), Math.round(d[1] * 255 / d[3]), Math.round(d[2] * 255 / d[3]), d[3] / 255] : [0, 0, 0, 0];
  } catch { out = null; }
  cache.set(color, out);
  return out;
};
