/**
 * Trechos de código exibidos nos slides: @maplibre/maplibre-react-native 11.x,
 * o mesmo usado em src/features/map-demo/MapDemo.tsx. O mapa ao vivo ao lado de
 * cada trecho é a versão MapLibre GL JS em src/slides/liveExamples.ts.
 */

export const installSnippet = `# 1. Criar o projeto (TypeScript)
npx create-expo-app@latest meu-mapa --template blank-typescript
cd meu-mapa

# 2. Instalar o MapLibre e o cliente de desenvolvimento
npx expo install @maplibre/maplibre-react-native expo-dev-client

# 3. Tipos GeoJSON (dependência de tipos usada pela biblioteca)
npm install --save-dev @types/geojson`;

export const appJsonSnippet = `{
  "expo": {
    "plugins": ["@maplibre/maplibre-react-native"]
  }
}`;

export const buildSnippet = `# Compila o app nativo com o MapLibre e instala no aparelho/emulador
npx expo run:android
npx expo run:ios        # somente em macOS com Xcode

# Alternativa na nuvem (sem Android Studio/Xcode local)
npx eas-cli@latest build --profile development --platform android

# No dia a dia: só o servidor JS (sem recompilar)
npx expo start`;

export const firstMapSnippet = `import { Camera, Map } from "@maplibre/maplibre-react-native";
import { StyleSheet } from "react-native";

// Estilo público do OpenFreeMap (sem chave de API)
const ESTILO = "https://tiles.openfreemap.org/styles/liberty";

export default function PrimeiroMapa() {
  return (
    <Map style={styles.map} mapStyle={ESTILO}>
      <Camera
        initialViewState={{
          center: [-46.6435, -23.5558], // [longitude, latitude]
          zoom: 12,
        }}
      />
    </Map>
  );
}

const styles = StyleSheet.create({ map: { flex: 1 } });`;

export const markerSnippet = `const cameraRef = useRef<CameraRef>(null);
const [selected, setSelected] = useState<Place | null>(null);

function selectPlace(place: Place) {
  setSelected(place);                // painel mostra nome e descrição
  cameraRef.current?.flyTo({ center: place.lngLat, zoom: 15, duration: 1200 });
}

<Map mapStyle={ESTILO}>
  <Camera ref={cameraRef} initialViewState={{ center: SP, zoom: 12 }} />
  {places.map((place) => (
    <Marker
      key={place.id}
      id={place.id}
      lngLat={place.lngLat}          // [longitude, latitude]
      anchor="bottom"
      onPress={() => selectPlace(place)}
    >
      <View style={[styles.pin, { backgroundColor: cor(place) }]}>
        <Text>{icone(place)}</Text>
      </View>
    </Marker>
  ))}
</Map>`;

export const interactionsSnippet = `// Botões: aproximar / afastar e enquadrar todos os pontos
cameraRef.current?.zoomTo(zoom + 1, { duration: 300 });
cameraRef.current?.fitBounds(placesBounds, {  // [oeste, sul, leste, norte]
  padding: { top: 40, right: 40, bottom: 40, left: 40 },
  duration: 800,
});

<Map
  mapStyle={ESTILO}
  onRegionDidChange={(e) => setZoom(e.nativeEvent.zoom)}
  onLongPress={(e) => setPonto(e.nativeEvent.lngLat)}  // coordenada tocada
>
  {showRoute && (
    <GeoJSONSource id="roteiro" data={tourLine}>
      <Layer
        type="line"
        id="roteiro-linha"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{ "line-color": "#B23A48", "line-width": 4 }}
      />
    </GeoJSONSource>
  )}
</Map>`;
