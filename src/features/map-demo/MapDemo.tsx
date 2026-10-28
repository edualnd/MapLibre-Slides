import {
  Camera,
  type CameraRef,
  GeoJSONSource,
  Layer,
  type LngLat,
  Map,
  Marker,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { mapStyles, type MapStyleId } from "./mapStyles";
import { categoryStyle, type Place, places, placesBounds, tourLine } from "./places";
import { colors, fonts } from "@/theme";

const INITIAL_CENTER: LngLat = [-46.6435, -23.5558]; // centro de São Paulo
const INITIAL_ZOOM = 12;

type Props = { onBack?: () => void };

export function MapDemo({ onBack }: Props) {
  const cameraRef = useRef<CameraRef>(null);

  const [styleId, setStyleId] = useState<MapStyleId>("liberty");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [center, setCenter] = useState<LngLat>(INITIAL_CENTER);
  const [pressedLngLat, setPressedLngLat] = useState<LngLat | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");

  const mapStyleUrl = mapStyles.find((style) => style.id === styleId)!.url;

  function selectPlace(place: Place) {
    setSelectedPlace(place);
    // Anima a câmera até o marcador escolhido.
    cameraRef.current?.flyTo({ center: place.lngLat, zoom: 15, duration: 1200 });
  }

  function changeZoom(delta: number) {
    cameraRef.current?.zoomTo(zoom + delta, { duration: 300 });
  }

  function showAllPlaces() {
    setSelectedPlace(null);
    cameraRef.current?.fitBounds(placesBounds, {
      padding: { top: 120, right: 48, bottom: 260, left: 48 },
      duration: 800,
    });
  }

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle={mapStyleUrl}
        compass
        scaleBar
        onDidFinishLoadingMap={() => setMapStatus("ready")}
        onDidFailLoadingMap={() => setMapStatus("error")}
        onRegionDidChange={(event) => {
          setZoom(event.nativeEvent.zoom);
          setCenter(event.nativeEvent.center);
        }}
        onLongPress={(event) => setPressedLngLat(event.nativeEvent.lngLat)}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{ center: INITIAL_CENTER, zoom: INITIAL_ZOOM }}
          minZoom={3}
          maxZoom={18}
        />

        {showRoute && (
          <GeoJSONSource id="roteiro" data={tourLine}>
            <Layer
              type="line"
              id="roteiro-linha"
              layout={{ "line-cap": "round", "line-join": "round" }}
              paint={{ "line-color": colors.alert, "line-width": 4, "line-dasharray": [2, 1.5] }}
            />
          </GeoJSONSource>
        )}

        {places.map((place) => {
          const category = categoryStyle[place.category];
          const isSelected = selectedPlace?.id === place.id;
          return (
            <Marker
              key={place.id}
              id={place.id}
              lngLat={place.lngLat}
              anchor="bottom"
              onPress={() => selectPlace(place)}
            >
              <View style={styles.markerWrapper}>
                <View
                  style={[
                    styles.markerPin,
                    { backgroundColor: category.color },
                    isSelected && styles.markerPinSelected,
                  ]}
                >
                  <Text style={styles.markerIcon}>{category.icon}</Text>
                </View>
                <View style={[styles.markerTip, { borderTopColor: category.color }]} />
              </View>
            </Marker>
          );
        })}
      </Map>

      {/* Barra superior: voltar + escolha do estilo */}
      <SafeAreaView edges={["top"]} style={styles.topOverlay} pointerEvents="box-none">
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
                onPress={() => {
                  setMapStatus("loading");
                  setStyleId(style.id);
                }}
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
              toque longo em [{pressedLngLat[0].toFixed(4)}, {pressedLngLat[1].toFixed(4)}]
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
      </SafeAreaView>

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
      <SafeAreaView edges={["bottom"]} style={styles.bottomPanel}>
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
          <Text style={styles.hint}>Toque em um marcador ou escolha um local abaixo.</Text>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  map: { flex: 1 },
  topOverlay: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 12 },
  topBar: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
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
  markerWrapper: { alignItems: "center" },
  markerPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  markerPinSelected: { width: 46, height: 46, borderRadius: 23, borderWidth: 3 },
  markerIcon: { fontSize: 16 },
  markerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
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
