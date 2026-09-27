globalThis.net19Theme = {
  detect: () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
  watch: ['data-theme'],
  later: /^(?:daily games|play daily games|playables|shorts|ign shorts|playlist|my playlist|playlists|are you playing\??|rewards|ign rewards|ign plus|get ign plus|join ign plus|add ign on google|add source)$/i,
};
