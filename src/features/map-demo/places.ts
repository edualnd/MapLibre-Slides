import type { LngLat } from "@maplibre/maplibre-react-native";

export type PlaceCategory = "museu" | "parque" | "mercado" | "igreja";

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  /** MapLibre usa sempre a ordem [longitude, latitude]. */
  lngLat: LngLat;
};

/**
 * Pontos de interesse da demonstração (centro de São Paulo).
 * Coordenadas aproximadas, suficientes para fins didáticos.
 */
export const places: Place[] = [
  {
    id: "masp",
    name: "MASP",
    category: "museu",
    description: "Museu de Arte de São Paulo, na Avenida Paulista.",
    lngLat: [-46.6559, -23.5614],
  },
  {
    id: "ibirapuera",
    name: "Parque Ibirapuera",
    category: "parque",
    description: "Maior parque urbano da região central da cidade.",
    lngLat: [-46.6576, -23.5874],
  },
  {
    id: "se",
    name: "Catedral da Sé",
    category: "igreja",
    description: "Catedral no marco zero da cidade.",
    lngLat: [-46.6343, -23.5505],
  },
  {
    id: "mercadao",
    name: "Mercado Municipal",
    category: "mercado",
    description: "Mercado histórico, conhecido como Mercadão.",
    lngLat: [-46.6297, -23.5417],
  },
  {
    id: "pinacoteca",
    name: "Pinacoteca",
    category: "museu",
    description: "Museu de artes visuais no bairro da Luz.",
    lngLat: [-46.6339, -23.5342],
  },
];

export const categoryStyle: Record<PlaceCategory, { color: string; label: string; icon: string }> = {
  museu: { color: "#7B4FA0", label: "Museu", icon: "🏛️" },
  parque: { color: "#2F855A", label: "Parque", icon: "🌳" },
  mercado: { color: "#E09F3E", label: "Mercado", icon: "🛒" },
  igreja: { color: "#2A6F97", label: "Igreja", icon: "⛪" },
};

/**
 * Linha ligando os pontos em sequência. É só um desenho (GeoJSON LineString):
 * não segue ruas. Para rotas reais seria necessário um serviço de roteamento.
 */
export const tourLine: GeoJSON.Feature<GeoJSON.LineString> = {
  type: "Feature",
  properties: { name: "Roteiro sugerido" },
  geometry: {
    type: "LineString",
    coordinates: ["pinacoteca", "mercadao", "se", "masp", "ibirapuera"].map(
      (id) => places.find((place) => place.id === id)!.lngLat,
    ),
  },
};

/** Limites [oeste, sul, leste, norte] que enquadram todos os pontos. */
export const placesBounds: [number, number, number, number] = [
  Math.min(...places.map((p) => p.lngLat[0])),
  Math.min(...places.map((p) => p.lngLat[1])),
  Math.max(...places.map((p) => p.lngLat[0])),
  Math.max(...places.map((p) => p.lngLat[1])),
];
