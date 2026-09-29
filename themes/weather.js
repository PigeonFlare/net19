globalThis.net19Theme = {
  later: /^(?:snowcast|weather labs|alexa skill|sitemap|mission|atmosphere|community guidelines|hurricane season|el ni[ñn]o|fall outlook|tornadoes|health & wellness|wildfires|fall travel|home & garden|search news)(?:external link)?$/i,
  detect: () => document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  watch: ['class'],
};
