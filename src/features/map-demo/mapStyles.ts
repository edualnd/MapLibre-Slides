/**
 * Estilos de mapa usados na demonstração.
 *
 * OpenFreeMap (https://openfreemap.org): instância pública sem chave de API,
 * dados do OpenStreetMap. Não há SLA: adequado para estudo e demonstração.
 * Em produção, avalie hospedar seus próprios tiles ou contratar um provedor.
 *
 * A atribuição (© OpenFreeMap © OpenMapTiles © OpenStreetMap) é obrigatória
 * e o MapLibre a exibe automaticamente a partir do estilo — não a esconda.
 */
export const mapStyles = [
  { id: "liberty", label: "Liberty", url: "https://tiles.openfreemap.org/styles/liberty" },
  { id: "positron", label: "Positron", url: "https://tiles.openfreemap.org/styles/positron" },
  { id: "demo", label: "Demo MapLibre", url: "https://demotiles.maplibre.org/style.json" },
] as const;

export type MapStyleId = (typeof mapStyles)[number]["id"];
