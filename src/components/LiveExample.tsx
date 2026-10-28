import { StyleSheet, Text, View } from "react-native";

import { CodeBlock } from "./CodeBlock";
import { useScale } from "./useScale";
import type { LiveExampleProps } from "@/slides/liveExamples";
import { colors } from "@/theme";

/**
 * No Android/iOS não há navegador para o MapLibre GL JS: mostramos só o código.
 * O mapa ao vivo fica em LiveExample.web.tsx.
 */
export function LiveExample({ code, title, highlight }: LiveExampleProps) {
  const { fs } = useScale();
  return (
    <View style={{ gap: 10 }}>
      <CodeBlock title={title} code={code} highlight={highlight} />
      <View style={styles.note}>
        <Text style={{ fontSize: fs(14), color: colors.inkSoft }}>
          O mapa ao vivo deste exemplo aparece na versão web da apresentação. No celular, abra a Demo.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  note: { backgroundColor: colors.card, borderRadius: 10, borderWidth: 1, borderColor: colors.line, padding: 12 },
});
