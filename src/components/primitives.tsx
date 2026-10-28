import type { ReactNode } from "react";
import { Linking, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { useScale } from "./useScale";
import { colors, fonts } from "@/theme";

/** Lista de tópicos curtos. Use **negrito** dentro do texto para destacar termos. */
export function Bullets({ items, color = colors.water }: { items: ReactNode[]; color?: string }) {
  const { fs } = useScale();
  return (
    <View style={{ gap: fs(10) }}>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <View style={[styles.bulletDot, { backgroundColor: color, marginTop: fs(8) }]} />
          <Text style={[styles.bulletText, { fontSize: fs(18), lineHeight: fs(26) }]}>
            {typeof item === "string" ? <Rich text={item} /> : item}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Interpreta **negrito** e `código` em uma string. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**")) return <Text key={i} style={styles.bold}>{part.slice(2, -2)}</Text>;
        if (part.startsWith("`")) return <Text key={i} style={styles.inlineCode}>{part.slice(1, -1)}</Text>;
        return <Text key={i}>{part}</Text>;
      })}
    </>
  );
}

export function P({ children, muted }: { children: string; muted?: boolean }) {
  const { fs } = useScale();
  return (
    <Text style={{ fontSize: fs(18), lineHeight: fs(27), color: muted ? colors.inkSoft : colors.ink }}>
      <Rich text={children} />
    </Text>
  );
}

type Tone = "info" | "warn" | "ok" | "alert";
const toneStyle: Record<Tone, { bg: string; border: string; icon: string }> = {
  info: { bg: "#E3EEF6", border: colors.water, icon: "ℹ️" },
  warn: { bg: "#FBF0DC", border: colors.road, icon: "⚠️" },
  ok: { bg: "#E2F2E8", border: colors.park, icon: "✅" },
  alert: { bg: colors.alertLight, border: colors.alert, icon: "⛔" },
};

export function Callout({ tone = "info", title, children }: { tone?: Tone; title?: string; children: string }) {
  const { fs } = useScale();
  const t = toneStyle[tone];
  return (
    <View style={[styles.callout, { backgroundColor: t.bg, borderLeftColor: t.border }]}>
      {title && (
        <Text style={[styles.calloutTitle, { fontSize: fs(16), color: t.border }]}>
          {t.icon} {title}
        </Text>
      )}
      <Text style={{ fontSize: fs(16), lineHeight: fs(23), color: colors.ink }}>
        <Rich text={children} />
      </Text>
    </View>
  );
}

/** Duas ou mais colunas no projetor; empilhadas no celular. */
export function Columns({ children, ratio }: { children: ReactNode[]; ratio?: number[] }) {
  const { wide, fs } = useScale();
  return (
    <View style={{ flexDirection: wide ? "row" : "column", gap: fs(24) }}>
      {children.map((child, i) => (
        <View key={i} style={wide ? { flex: ratio?.[i] ?? 1, minWidth: 0 } : undefined}>
          {child}
        </View>
      ))}
    </View>
  );
}

export function Stack({ children, gap = 16, style }: { children: ReactNode; gap?: number; style?: ViewStyle }) {
  const { fs } = useScale();
  return <View style={[{ gap: fs(gap) }, style]}>{children}</View>;
}

export function Pill({ label, color = colors.water }: { label: string; color?: string }) {
  const { fs } = useScale();
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={{ color, fontWeight: "700", fontSize: fs(13) }}>{label}</Text>
    </View>
  );
}

export function SubTitle({ children, color = colors.ink }: { children: string; color?: string }) {
  const { fs } = useScale();
  return <Text style={{ fontSize: fs(20), fontWeight: "800", color }}>{children}</Text>;
}

/** Cartão com título e conteúdo, usado em grades de conceitos. */
export function InfoCard({
  icon,
  title,
  children,
  accent = colors.water,
}: {
  icon?: string;
  title: string;
  children: string;
  accent?: string;
}) {
  const { fs } = useScale();
  return (
    <View style={[styles.infoCard, { borderTopColor: accent }]}>
      <Text style={{ fontSize: fs(17), fontWeight: "800", color: colors.ink }}>
        {icon ? `${icon}  ` : ""}
        {title}
      </Text>
      <Text style={{ fontSize: fs(15), lineHeight: fs(22), color: colors.inkSoft, marginTop: 6 }}>
        <Rich text={children} />
      </Text>
    </View>
  );
}

export function Grid({ children, columns = 3 }: { children: ReactNode[]; columns?: number }) {
  const { wide, fs } = useScale();
  const perRow = wide ? columns : 1;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -fs(6) }}>
      {children.map((child, i) => (
        <View key={i} style={{ width: `${100 / perRow}%`, padding: fs(6) }}>
          {child}
        </View>
      ))}
    </View>
  );
}

export function RefLink({ label, url }: { label: string; url: string }) {
  const { fs } = useScale();
  return (
    <Pressable onPress={() => Linking.openURL(url)} accessibilityRole="link" style={styles.refRow}>
      <Text style={{ fontSize: fs(16), color: colors.ink, fontWeight: "700" }}>{label}</Text>
      <Text style={{ fontSize: fs(13), color: colors.water, fontFamily: fonts.mono, textDecorationLine: "underline" }}>
        {url}
      </Text>
    </Pressable>
  );
}

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { fs } = useScale();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && { opacity: 0.8 }]}>
      <Text style={{ color: "#fff", fontWeight: "800", fontSize: fs(17) }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bulletRow: { flexDirection: "row", gap: 12 },
  bulletDot: { width: 8, height: 8, borderRadius: 4 },
  bulletText: { flex: 1, color: colors.ink },
  bold: { fontWeight: "800" },
  inlineCode: { fontFamily: fonts.mono, backgroundColor: colors.paperDeep, color: colors.alert },
  callout: { borderLeftWidth: 4, borderRadius: 8, padding: 14, gap: 4 },
  calloutTitle: { fontWeight: "800" },
  pill: { borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start" },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 4,
    flexGrow: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  refRow: { paddingVertical: 6, gap: 2 },
  primaryButton: {
    backgroundColor: colors.water,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
});
