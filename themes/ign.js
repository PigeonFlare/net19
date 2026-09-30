globalThis.net19Theme = {
  detect: () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
  watch: ['data-theme'],
  later: /^(?:daily games|play daily games|playables|shorts|ign shorts|playlist|my playlist|playlists|are you playing\??|rewards|ign rewards|ign plus|get ign plus|join ign plus|add ign on google|add source|book guides|streaming guides|lego guides|prime big deal days|planet pokemon|ign store|game release dates|mapgenie|eurogamer|howlongtobeat|maxroll|vg247|rock paper shotgun|ign tiktok)$/i,
};
