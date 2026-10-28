import * as maplibregl from "maplibre-gl";
import type { GeoJSONSource, Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { mapStyles, type MapStyleId } from "./mapStyles";
import { categoryStyle, type Place, places, placesBounds, tourLine } from "./places";
import { colors, fonts } from "@/theme";

type LngLat = [number, number];

const INITIAL_CENTER: LngLat = [-46.6435, -23.5558]; // centro de São Paulo
const INITIAL_ZOOM = 12;
const ROUTE_SOURCE = "roteiro";
const ROUTE_LAYER = "roteiro-linha";

// O worker do MapLibre GL JS é um arquivo separado do bundle. Como o Metro não
// o empacota, apontamos para a cópia publicada da mesma versão instalada.
maplibregl.setWorkerUrl(
  `https://unpkg.com/maplibre-gl@${maplibregl.getVersion()}/dist/maplibre-gl-worker.mjs`,
);

type Props = { onBack?: () => void };

/**
 * Versão web da demonstração. O Metro escolhe este arquivo automaticamente na
 * web (extensão .web.tsx). @maplibre/maplibre-react-native só tem implementação
 * nativa, então aqui usamos o MapLibre GL JS (pacote maplibre-gl) diretamente,
 * com os mesmos estilos, locais e interações do MapDemo.tsx.
 */
export function MapDemo({ onBack }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const showRouteRef = useRef(false);

  const [styleId, setStyleId] = useState<MapStyleId>("liberty");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [center, setCenter] = useState<LngLat>(INITIAL_CENTER);
  const [pressedLngLat, setPressedLngLat] = useState<LngLat | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");

  function selectPlace(place: Place) {
    setSelectedPlace(place);
    // Anima a câmera até o marcador escolhido.
    mapRef.current?.flyTo({ center: place.lngLat, zoom: 15, duration: 1200 });
  }

  // Cria o mapa uma única vez; os efeitos abaixo reagem às mudanças de estado.
  useEffect(() => {
    // No react-native-web, a ref de uma View é o próprio elemento <div>.
    const container = containerRef.current!;
    const map = new maplibregl.Map({
      container,
      style: mapStyles[0].url,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      minZoom: 3,
      maxZoom: 18,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showZoom: false }), "top-right");
    map.addControl(new maplibregl.ScaleControl(), "bottom-left");

    // Trocar o estilo apaga fontes e camadas próprias: recolocamos a linha.
    map.on("style.load", () => {
      setMapStatus("ready");
      syncRoute(map, showRouteRef.current);
    });
    map.on("error", () => {
      if (!map.isStyleLoaded()) setMapStatus("error");
    });
    map.on("moveend", () => {
      const { lng, lat } = map.getCenter();
      setZoom(map.getZoom());
      setCenter([lng, lat]);
    });
    // Clique com o botão direito (ou toque longo no celular) equivale ao onLongPress.
    map.on("contextmenu", (event) => setPressedLngLat([event.lngLat.lng, event.lngLat.lat]));

    for (const place of places) {
      const element = createMarkerElement(place);
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        setSelectedPlace(place);
        map.flyTo({ center: place.lngLat, zoom: 15, duration: 1200 });
      });
      markersRef.current[place.id] = new maplibregl.Marker({ element, anchor: "bottom" })
        .setLngLat(place.lngLat)
        .addTo(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    for (const [id, marker] of Object.entries(markersRef.current)) {
      marker.getElement().classList.toggle("selected", selectedPlace?.id === id);
    }
  }, [selectedPlace]);

  useEffect(() => {
    showRouteRef.current = showRoute;
    const map = mapRef.current;
    if (map?.isStyleLoaded()) syncRoute(map, showRoute);
  }, [showRoute]);

  function changeStyle(id: MapStyleId) {
    if (id === styleId) return;
    setMapStatus("loading");
    setStyleId(id);
    mapRef.current?.setStyle(mapStyles.find((style) => style.id === id)!.url);
  }

  function changeZoom(delta: number) {
    mapRef.current?.zoomTo(zoom + delta, { duration: 300 });
  }

  function showAllPlaces() {
    setSelectedPlace(null);
    mapRef.current?.fitBounds(placesBounds, {
      padding: { top: 120, right: 48, bottom: 260, left: 48 },
      duration: 800,
    });
  }

  return (
    <View style={styles.container}>
      <View ref={containerRef as never} style={styles.map} />

      {/* Barra superior: voltar + escolha do estilo */}
      <View style={styles.topOverlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          {onBack && (
            <Pressable style={styles.backButton} onPress={onBack} accessibilityRole="button">
              <Text style={styles.backText}>‹ Slides</Text>
            </Pressable>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mapStyles.map((style) => (
              <Pressable
                key={style.id}
                onPress={() => changeStyle(style.id)}
                style={[styles.chip, style.id === styleId && styles.chipActive]}
              >
                <Text style={[styles.chipText, style.id === styleId && styles.chipTextActive]}>
                  {style.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <View style={styles.hud}>
          <Text style={styles.hudText}>
            zoom {zoom.toFixed(1)} · lat {center[1].toFixed(4)} · lng {center[0].toFixed(4)}
          </Text>
          {pressedLngLat && (
            <Text style={styles.hudText}>
              clique direito em [{pressedLngLat[0].toFixed(4)}, {pressedLngLat[1].toFixed(4)}]
            </Text>
          )}
        </View>
        {mapStatus === "error" && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>
              Não foi possível carregar o estilo. Verifique a internet ou troque o estilo acima.
            </Text>
          </View>
        )}
      </View>

      {/* Controles de zoom */}
      <View style={styles.zoomControls}>
        <Pressable style={styles.roundButton} onPress={() => changeZoom(1)} accessibilityLabel="Aproximar">
          <Text style={styles.roundButtonText}>+</Text>
        </Pressable>
        <Pressable style={styles.roundButton} onPress={() => changeZoom(-1)} accessibilityLabel="Afastar">
          <Text style={styles.roundButtonText}>−</Text>
        </Pressable>
      </View>

      {/* Painel inferior: informações do local e ações */}
      <View style={styles.bottomPanel}>
        {selectedPlace ? (
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>
                {categoryStyle[selectedPlace.category].icon} {selectedPlace.name}
              </Text>
              <Pressable onPress={() => setSelectedPlace(null)} hitSlop={12}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.infoCategory}>{categoryStyle[selectedPlace.category].label}</Text>
            <Text style={styles.infoDescription}>{selectedPlace.description}</Text>
            <Text style={styles.infoCoords}>
              lng {selectedPlace.lngLat[0]} · lat {selectedPlace.lngLat[1]}
            </Text>
          </View>
        ) : (
          <Text style={styles.hint}>Clique em um marcador ou escolha um local abaixo.</Text>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.placeList}>
          {places.map((place) => (
            <Pressable
              key={place.id}
              onPress={() => selectPlace(place)}
              style={[styles.chip, selectedPlace?.id === place.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, selectedPlace?.id === place.id && styles.chipTextActive]}>
                {categoryStyle[place.category].icon} {place.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={showAllPlaces}>
            <Text style={styles.actionText}>Ver todos</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, showRoute && styles.actionButtonActive]}
            onPress={() => setShowRoute((value) => !value)}
          >
            <Text style={[styles.actionText, showRoute && styles.actionTextActive]}>
              {showRoute ? "Ocultar linha" : "Mostrar linha do roteiro"}
            </Text>
          </Pressable>
        </View>
        {mapStatus === "loading" && <Text style={styles.loading}>Carregando estilo…</Text>}
      </View>
    </View>
  );
}

/** Mostra ou remove a linha do roteiro (GeoJSON source + line layer). */
function syncRoute(map: MapLibreMap, visible: boolean) {
  const hasSource = Boolean(map.getSource<GeoJSONSource>(ROUTE_SOURCE));
  if (visible && !hasSource) {
    map.addSource(ROUTE_SOURCE, { type: "geojson", data: tourLine });
    map.addLayer({
      id: ROUTE_LAYER,
      type: "line",
      source: ROUTE_SOURCE,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": colors.alert, "line-width": 4, "line-dasharray": [2, 1.5] },
    });
  } else if (!visible && hasSource) {
    map.removeLayer(ROUTE_LAYER);
    map.removeSource(ROUTE_SOURCE);
  }
}

/** Marcador em HTML puro: no GL JS, o Marker recebe um elemento do DOM. */
function createMarkerElement(place: Place) {
  const category = categoryStyle[place.category];
  const element = document.createElement("div");
  element.className = "demo-marker";
  element.style.setProperty("--marker-color", category.color);
  element.innerHTML = `<div class="demo-marker-pin">${category.icon}</div><div class="demo-marker-tip"></div>`;
  element.title = place.name;
  return element;
}

// Estilos dos marcadores (elementos do DOM, fora do StyleSheet do React Native).
if (typeof document !== "undefined" && !document.getElementById("demo-marker-css")) {
  const style = document.createElement("style");
  style.id = "demo-marker-css";
  style.textContent = `
    .demo-marker { display: flex; flex-direction: column; align-items: center; cursor: pointer; }
    .demo-marker-pin {
      width: 36px; height: 36px; border-radius: 50%; border: 2px solid #fff; box-sizing: border-box;
      background: var(--marker-color); display: flex; align-items: center; justify-content: center;
      font-size: 16px; transition: width .15s, height .15s;
    }
    .demo-marker.selected .demo-marker-pin { width: 46px; height: 46px; border-width: 3px; }
    .demo-marker-tip {
      width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent;
      border-top: 8px solid var(--marker-color);
    }
  `;
  document.head.appendChild(style);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  map: { flex: 1 },
  topOverlay: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 12 },
  topBar: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8, marginRight: 48 },
  backButton: {
    backgroundColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backText: { color: "#fff", fontWeight: "700" },
  hud: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: "rgba(19,41,61,0.85)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  hudText: { color: "#fff", fontFamily: fonts.mono, fontSize: 12 },
  errorBanner: {
    marginTop: 8,
    backgroundColor: colors.alertLight,
    borderColor: colors.alert,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  errorText: { color: colors.alert, fontWeight: "600" },
  chip: {
    backgroundColor: "#fff",
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.water, borderColor: colors.water },
  chipText: { color: colors.ink, fontWeight: "600", fontSize: 13 },
  chipTextActive: { color: "#fff" },
  zoomControls: { position: "absolute", right: 12, top: "40%", gap: 8 },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.line,
    borderWidth: 1,
  },
  roundButtonText: { fontSize: 22, fontWeight: "700", color: colors.ink },
  bottomPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.paper,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderColor: colors.line,
  },
  infoCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 10 },
  infoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoTitle: { fontSize: 18, fontWeight: "800", color: colors.ink },
  closeText: { fontSize: 18, color: colors.inkMuted },
  infoCategory: { color: colors.water, fontWeight: "700", marginTop: 2 },
  infoDescription: { color: colors.inkSoft, marginTop: 4 },
  infoCoords: { color: colors.inkMuted, fontFamily: fonts.mono, fontSize: 12, marginTop: 6 },
  hint: { color: colors.inkSoft, marginBottom: 10 },
  placeList: { flexGrow: 0, marginBottom: 10 },
  actions: { flexDirection: "row", gap: 8 },
  actionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  actionButtonActive: { backgroundColor: colors.ink },
  actionText: { color: colors.ink, fontWeight: "700" },
  actionTextActive: { color: "#fff" },
  loading: { textAlign: "center", color: colors.inkMuted, marginTop: 6, fontSize: 12 },
});
