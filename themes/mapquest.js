// MapQuest has no dark mode; default detection keeps it light. Its map is a picture and keeps its real colors in a
// flipped (dark) page, so the controls, scale and credits drawn on the map stay as drawn with it.
globalThis.net19Theme = { keep: '.maplibregl-control-container, .mapboxgl-control-container, .leaflet-control-container' };
