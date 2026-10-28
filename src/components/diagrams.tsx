import { StyleSheet, Text, View } from "react-native";

import { useScale } from "./useScale";
import { colors, fonts } from "@/theme";

/* ------------------------------------------------------------------ */
/* Ilustração de mapa (desenhada com Views; não é um mapa real)        */
/* ------------------------------------------------------------------ */

type MockPin = { x: number; y: number; color: string; label?: string; selected?: boolean };

export function MapMock({
  height = 260,
  showTiles = false,
  pins = [],
  caption,
}: {
  height?: number;
  showTiles?: boolean;
  pins?: MockPin[];
  caption?: string;
}) {
  const { fs } = useScale();
  const h = fs(height);
  return (
    <View>
      <View style={[mock.frame, { height: h }]}>
        {/* água */}
        <View style={[mock.river, { top: h * 0.55, transform: [{ rotate: "-12deg" }] }]} />
        {/* parques */}
        <View style={[mock.park, { left: "8%", top: "12%", width: "26%", height: "28%" }]} />
        <View style={[mock.park, { left: "66%", top: "68%", width: "22%", height: "22%" }]} />
        {/* vias */}
        <View style={[mock.road, { top: "30%", transform: [{ rotate: "8deg" }] }]} />
        <View style={[mock.road, mock.roadMinor, { top: "78%", transform: [{ rotate: "-4deg" }] }]} />
        <View style={[mock.roadV, { left: "48%" }]} />
        <View style={[mock.roadV, mock.roadMinor, { left: "78%", transform: [{ rotate: "10deg" }] }]} />
        {/* grade de tiles */}
        {showTiles &&
          [0, 1, 2, 3].map((c) =>
            [0, 1].map((r) => (
              <View
                key={`${c}-${r}`}
                style={[mock.tile, { left: `${c * 25}%`, top: `${r * 50}%` }]}
              >
                <Text style={[mock.tileLabel, { fontSize: fs(10) }]}>
                  z/{c}/{r}
                </Text>
              </View>
            )),
          )}
        {/* marcadores */}
        {pins.map((pin, i) => (
          <View key={i} style={[mock.pinWrap, { left: `${pin.x}%`, top: `${pin.y}%` }]}>
            {pin.label && pin.selected && (
              <View style={mock.bubble}>
                <Text style={[mock.bubbleText, { fontSize: fs(11) }]}>{pin.label}</Text>
              </View>
            )}
            <View
              style={[
                mock.pin,
                { backgroundColor: pin.color },
                pin.selected && { width: 26, height: 26, borderRadius: 13, borderWidth: 3 },
              ]}
            />
            <View style={[mock.pinTip, { borderTopColor: pin.color }]} />
          </View>
        ))}
        <Text style={[mock.attribution, { fontSize: fs(9) }]}>© OpenStreetMap (ilustração)</Text>
      </View>
      {caption && <Text style={[mock.caption, { fontSize: fs(13) }]}>{caption}</Text>}
    </View>
  );
}

const mock = StyleSheet.create({
  frame: {
    backgroundColor: "#EFEADF",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line,
  },
  river: { position: "absolute", left: "-10%", width: "120%", height: 28, backgroundColor: colors.waterLight },
  park: { position: "absolute", backgroundColor: colors.parkLight, borderRadius: 18 },
  road: { position: "absolute", left: "-10%", width: "120%", height: 8, backgroundColor: "#fff", borderColor: colors.roadLight, borderWidth: 1.5 },
  roadMinor: { height: 5, opacity: 0.9 },
  roadV: { position: "absolute", top: "-10%", height: "120%", width: 7, backgroundColor: "#fff", borderColor: colors.roadLight, borderWidth: 1.5 },
  tile: {
    position: "absolute",
    width: "25%",
    height: "50%",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(19,41,61,0.45)",
    padding: 4,
  },
  tileLabel: { fontFamily: fonts.mono, color: colors.inkSoft },
  pinWrap: { position: "absolute", alignItems: "center", transform: [{ translateX: -11 }, { translateY: -28 }] },
  pin: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#fff" },
  pinTip: {
    width: 0, height: 0,
    borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 7,
    borderLeftColor: "transparent", borderRightColor: "transparent",
  },
  bubble: { backgroundColor: colors.ink, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 4 },
  bubbleText: { color: "#fff", fontWeight: "700" },
  attribution: { position: "absolute", right: 6, bottom: 4, color: colors.inkSoft, backgroundColor: "rgba(255,255,255,0.7)", paddingHorizontal: 4 },
  caption: { color: colors.inkMuted, marginTop: 6, fontStyle: "italic" },
});

/* ------------------------------------------------------------------ */
/* Como funciona um mapa digital                                       */
/* ------------------------------------------------------------------ */

function Box({ title, subtitle, color, tag }: { title: string; subtitle: string; color: string; tag?: string }) {
  const { fs } = useScale();
  return (
    <View style={[diag.box, { borderColor: color }]}>
      {tag && (
        <View style={[diag.tag, { backgroundColor: color }]}>
          <Text style={[diag.tagText, { fontSize: fs(11) }]}>{tag}</Text>
        </View>
      )}
      <Text style={[diag.boxTitle, { fontSize: fs(16), color }]}>{title}</Text>
      <Text style={[diag.boxSubtitle, { fontSize: fs(13) }]}>{subtitle}</Text>
    </View>
  );
}

function Arrow({ label, vertical }: { label?: string; vertical?: boolean }) {
  const { fs } = useScale();
  return (
    <View style={[diag.arrow, vertical ? { paddingVertical: 4 } : { paddingHorizontal: 4 }]}>
      <Text style={{ fontSize: fs(20), color: colors.inkMuted }}>{vertical ? "↓" : "→"}</Text>
      {label && <Text style={[diag.arrowLabel, { fontSize: fs(11) }]}>{label}</Text>}
    </View>
  );
}

export function MapStackDiagram() {
  const { wide } = useScale();
  const providers = (
    <View style={{ gap: 10, flex: wide ? 1 : undefined }}>
      <Box
        tag="provedor"
        title="Servidor de tiles"
        subtitle="Entrega o mapa em pedaços (tiles) por zoom/x/y"
        color={colors.road}
      />
      <Box tag="JSON" title="Estilo (style.json)" subtitle="Diz quais fontes usar e como pintar cada camada" color={colors.road} />
      <Box tag="seus dados" title="Dados geográficos" subtitle="Seus pontos, linhas e áreas (ex.: GeoJSON)" color={colors.park} />
    </View>
  );
  const library = (
    <View style={{ flex: wide ? 1 : undefined }}>
      <Box
        tag="biblioteca"
        title="MapLibre Native"
        subtitle="Baixa tiles, aplica o estilo, desenha com a GPU e trata gestos"
        color={colors.water}
      />
    </View>
  );
  const app = (
    <View style={{ flex: wide ? 1 : undefined }}>
      <Box tag="você" title="App React Native" subtitle="Diz ONDE olhar (câmera) e O QUE mostrar (marcadores)" color={colors.ink} />
    </View>
  );
  return (
    <View style={[diag.row, !wide && { flexDirection: "column", alignItems: "stretch" }]}>
      {providers}
      <Arrow vertical={!wide} label="HTTP" />
      {library}
      <Arrow vertical={!wide} label="props/eventos" />
      {app}
    </View>
  );
}

export function CoordinateBadge() {
  const { fs } = useScale();
  return (
    <View style={diag.coord}>
      <Text style={[diag.coordCode, { fontSize: fs(18) }]}>[-46.6559, -23.5614]</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Text style={[diag.coordLabel, { fontSize: fs(12), color: colors.road }]}>longitude (leste/oeste)</Text>
        <Text style={[diag.coordLabel, { fontSize: fs(12), color: colors.park }]}>latitude (norte/sul)</Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Expo Go x development build                                         */
/* ------------------------------------------------------------------ */

export function BuildComparison() {
  const { wide, fs } = useScale();
  const col = (title: string, color: string, items: string[], verdict: string, ok: boolean) => (
    <View style={[diag.buildCol, { borderColor: color }, wide && { flex: 1 }]}>
      <Text style={{ fontSize: fs(18), fontWeight: "800", color }}>{title}</Text>
      {items.map((item) => (
        <Text key={item} style={{ fontSize: fs(14), lineHeight: fs(21), color: colors.inkSoft }}>
          • {item}
        </Text>
      ))}
      <View style={[diag.verdict, { backgroundColor: ok ? colors.parkLight : colors.alertLight }]}>
        <Text style={{ fontWeight: "800", fontSize: fs(14), color: ok ? colors.park : colors.alert }}>{verdict}</Text>
      </View>
    </View>
  );
  return (
    <View style={{ flexDirection: wide ? "row" : "column", gap: 14 }}>
      {col(
        "Expo Go",
        colors.inkSoft,
        ["App pronto da loja", "Só contém os módulos nativos do Expo SDK", "Bom para começar rápido"],
        "MapLibre NÃO funciona aqui",
        false,
      )}
      {col(
        "Development build",
        colors.water,
        ["Seu próprio app de desenvolvimento", "Inclui qualquer módulo nativo (ex.: MapLibre)", "Gerado com expo run:* ou EAS Build"],
        "MapLibre funciona ✔",
        true,
      )}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Árvore de componentes                                               */
/* ------------------------------------------------------------------ */

const tree: { depth: number; name: string; desc: string; color: string }[] = [
  { depth: 0, name: "<Map mapStyle>", desc: "contêiner: carrega o estilo e desenha", color: colors.water },
  { depth: 1, name: "<Camera>", desc: "posição, zoom, animações (ref)", color: colors.road },
  { depth: 1, name: "<Marker lngLat>", desc: "uma View do React Native presa a uma coordenada", color: colors.alert },
  { depth: 1, name: "<GeoJSONSource data>", desc: "fonte de dados (pontos, linhas, áreas)", color: colors.park },
  { depth: 2, name: '<Layer type="line">', desc: "como desenhar a fonte (paint/layout)", color: colors.park },
];

export function ComponentTree() {
  const { fs } = useScale();
  return (
    <View style={diag.tree}>
      {tree.map((node) => (
        <View key={node.name} style={[diag.treeRow, { marginLeft: node.depth * fs(26) }]}>
          {node.depth > 0 && <Text style={[diag.treeBranch, { fontSize: fs(15) }]}>└─</Text>}
          <Text style={[diag.treeName, { fontSize: fs(15), color: node.color }]}>{node.name}</Text>
          <Text style={[diag.treeDesc, { fontSize: fs(13) }]}>{node.desc}</Text>
        </View>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Tabela comparativa                                                  */
/* ------------------------------------------------------------------ */

export function ComparisonTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  const { fs, wide } = useScale();
  return (
    <View style={diag.table}>
      <View style={[diag.tr, diag.thRow]}>
        {headers.map((header, i) => (
          <Text key={header} style={[diag.th, { fontSize: fs(14), flex: i === 0 ? 0.8 : 1 }]}>
            {header}
          </Text>
        ))}
      </View>
      {rows.map((row, r) => (
        <View key={r} style={[diag.tr, r % 2 === 1 && { backgroundColor: colors.paper }]}>
          {row.map((cell, c) => (
            <Text
              key={c}
              style={[
                diag.td,
                { fontSize: fs(wide ? 13.5 : 12), lineHeight: fs(wide ? 19 : 17), flex: c === 0 ? 0.8 : 1 },
                c === 0 && diag.tdHead,
              ]}
            >
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const diag = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  box: { borderWidth: 2, borderRadius: 12, padding: 12, backgroundColor: colors.card },
  tag: { position: "absolute", top: -10, right: 10, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  tagText: { color: "#fff", fontWeight: "800", textTransform: "uppercase" },
  boxTitle: { fontWeight: "800" },
  boxSubtitle: { color: colors.inkSoft, marginTop: 3 },
  arrow: { alignItems: "center", justifyContent: "center" },
  arrowLabel: { color: colors.inkMuted, fontFamily: fonts.mono },
  coord: { backgroundColor: colors.codeBg, borderRadius: 12, padding: 14, gap: 6 },
  coordCode: { color: colors.codeText, fontFamily: fonts.mono, textAlign: "center", fontWeight: "700" },
  coordLabel: { fontWeight: "700" },
  buildCol: { borderWidth: 2, borderRadius: 12, padding: 16, gap: 6, backgroundColor: colors.card },
  verdict: { marginTop: 8, borderRadius: 8, padding: 8, alignItems: "center" },
  tree: { backgroundColor: colors.card, borderRadius: 12, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.line },
  treeRow: { flexDirection: "row", alignItems: "baseline", flexWrap: "wrap", gap: 8 },
  treeBranch: { color: colors.inkMuted, fontFamily: fonts.mono },
  treeName: { fontFamily: fonts.mono, fontWeight: "800" },
  treeDesc: { color: colors.inkSoft },
  table: { borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  tr: { flexDirection: "row" },
  thRow: { backgroundColor: colors.ink },
  th: { color: "#fff", fontWeight: "800", padding: 8 },
  td: { padding: 8, color: colors.ink, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  tdHead: { fontWeight: "800", color: colors.inkSoft },
});
