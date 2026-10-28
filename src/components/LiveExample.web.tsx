import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CodeBlock } from "./CodeBlock";
import { useScale } from "./useScale";
import type { LiveExampleProps } from "@/slides/liveExamples";
import { colors } from "@/theme";

// O worker do GL JS é um arquivo separado que o Metro não empacota.
maplibregl.setWorkerUrl(
  `https://unpkg.com/maplibre-gl@${maplibregl.getVersion()}/dist/maplibre-gl-worker.mjs`,
);

/**
 * Código React Native (o que roda no app) ao lado de um mapa ao vivo.
 * O pacote nativo não roda no navegador, então o mapa é desenhado com o
 * MapLibre GL JS, reproduzindo o mesmo resultado do código.
 */
export function LiveExample({ code, title, highlight, example, height = 540 }: LiveExampleProps) {
  const { fs, wide } = useScale();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    const map = new maplibregl.Map({ container: containerRef.current!, ...example.view });
    mapRef.current = map;
    map.on("load", () => example.setup?.(map, maplibregl));
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [example]);

  const box = wide ? { flex: 1, height } : { height: height * 0.8 };

  return (
    <View style={[styles.root, { flexDirection: wide ? "row" : "column" }]}>
      <View style={wide ? { flex: 1.15 } : undefined}>
        <CodeBlock title={title} code={code} highlight={highlight} />
      </View>
      <View style={[styles.side, box]}>
        <View style={styles.mapFrame}>
          <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
          <View style={styles.badge} pointerEvents="none">
            <Text style={[styles.badgeText, { fontSize: fs(11) }]}>AO VIVO · MapLibre GL JS</Text>
          </View>
        </View>
        {example.actions && (
          <View style={styles.actions}>
            {example.actions.map((action) => (
              <Pressable
                key={action.label}
                style={styles.action}
                onPress={() => mapRef.current && action.run(mapRef.current, maplibregl)}
              >
                <Text style={[styles.actionText, { fontSize: fs(13) }]}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 14 },
  side: { gap: 10 },
  mapFrame: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paperDeep,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(19,41,61,0.85)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { color: "#fff", fontWeight: "800", letterSpacing: 0.6 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  action: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionText: { color: colors.ink, fontWeight: "700" },
});
