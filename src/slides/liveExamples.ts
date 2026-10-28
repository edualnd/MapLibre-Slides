import type { Map as GLMap, MapOptions } from "maplibre-gl";

import { categoryStyle, type Place, places, placesBounds, tourLine } from "@/features/map-demo/places";

type GL = typeof import("maplibre-gl");

/**
 * Versão MapLibre GL JS de um exemplo. O slide mostra o código React Native;
 * isto reproduz o mesmo resultado no navegador (ver LiveExample.web.tsx).
 */
export type LiveExampleDef = {
  view: Omit<MapOptions, "container">;
  /** Roda quando o mapa termina de carregar. */
  setup?: (map: GLMap, gl: GL) => void;
  /** Botões abaixo do mapa, equivalentes às ações do código. */
  actions?: { label: string; run: (map: GLMap, gl: GL) => void }[];
};

export type LiveExampleProps = {
  code: string;
  title?: string;
  highlight?: number[];
  example: LiveExampleDef;
  height?: number;
};

const LIBERTY = "https://tiles.openfreemap.org/styles/liberty";
const POSITRON = "https://tiles.openfreemap.org/styles/positron";
const SP: [number, number] = [-46.6435, -23.5558];
const START = { center: SP, zoom: 12 };

export const firstMapExample: LiveExampleDef = {
  view: { style: LIBERTY, ...START },
  actions: [
    { label: "zoom: 15", run: (map) => map.easeTo({ zoom: 15 }) },
    { label: "center: Rio de Janeiro", run: (map) => map.jumpTo({ center: [-43.1729, -22.9068], zoom: 12 }) },
    { label: "mapStyle: Positron", run: (map) => map.setStyle(POSITRON) },
    {
      label: "↺ Valores do código",
      run: (map) => {
        map.setStyle(LIBERTY);
        map.jumpTo(START);
      },
    },
  ],
};

/** Pino com cor e ícone da categoria, como a View dentro do <Marker>. */
function pinElement(place: Place) {
  const { color, icon } = categoryStyle[place.category];
  const el = document.createElement("div");
  el.style.cssText = "display:flex;flex-direction:column;align-items:center;cursor:pointer";
  el.innerHTML =
    `<div style="width:36px;height:36px;border-radius:50%;border:2px solid #fff;box-sizing:border-box;` +
    `background:${color};display:flex;align-items:center;justify-content:center;font-size:16px">${icon}</div>` +
    `<div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;` +
    `border-top:8px solid ${color}"></div>`;
  return el;
}

export const markersExample: LiveExampleDef = {
  view: { style: LIBERTY, ...START },
  setup: (map, gl) => {
    for (const place of places) {
      const el = pinElement(place);
      new gl.Marker({ element: el, anchor: "bottom" }).setLngLat(place.lngLat).addTo(map);
      // onPress={() => selectPlace(place)}
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        new gl.Popup({ offset: 48, closeButton: false })
          .setLngLat(place.lngLat)
          .setHTML(`<strong>${place.name}</strong><br/>${place.description}`)
          .addTo(map);
        map.flyTo({ center: place.lngLat, zoom: 15, duration: 1200 });
      });
    }
  },
  actions: [
    { label: "selectPlace(MASP)", run: (map) => map.flyTo({ center: places[0].lngLat, zoom: 15, duration: 1200 }) },
    { label: "Voltar ao início", run: (map) => map.flyTo({ ...START, duration: 800 }) },
  ],
};

function toggleRoute(map: GLMap) {
  if (map.getLayer("roteiro-linha")) {
    map.removeLayer("roteiro-linha");
    map.removeSource("roteiro");
    return;
  }
  map.addSource("roteiro", { type: "geojson", data: tourLine });
  map.addLayer({
    id: "roteiro-linha",
    type: "line",
    source: "roteiro",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#B23A48", "line-width": 4 },
  });
}

export const interactionsExample: LiveExampleDef = {
  view: { style: LIBERTY, ...START },
  setup: (map, gl) => {
    for (const place of places) new gl.Marker({ element: pinElement(place), anchor: "bottom" }).setLngLat(place.lngLat).addTo(map);
    toggleRoute(map);
    // onLongPress: no navegador, clique (ou botão direito) mostra a coordenada.
    const showPoint = (event: { lngLat: { lng: number; lat: number } }) => {
      const { lng, lat } = event.lngLat;
      new gl.Popup().setLngLat([lng, lat]).setHTML(`[${lng.toFixed(4)}, ${lat.toFixed(4)}]`).addTo(map);
    };
    map.on("click", showPoint);
    map.on("contextmenu", showPoint);
  },
  actions: [
    { label: "zoomTo(zoom + 1)", run: (map) => map.zoomTo(map.getZoom() + 1, { duration: 300 }) },
    { label: "zoomTo(zoom − 1)", run: (map) => map.zoomTo(map.getZoom() - 1, { duration: 300 }) },
    { label: "fitBounds(placesBounds)", run: (map) => map.fitBounds(placesBounds, { padding: 40, duration: 800 }) },
    { label: "showRoute on/off", run: toggleRoute },
  ],
};
