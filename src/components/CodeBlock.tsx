import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useScale } from "./useScale";
import { colors, fonts } from "@/theme";

type Token = { text: string; color: string };

const KEYWORDS = new Set([
  "import", "from", "export", "default", "function", "return", "const", "let", "type",
  "if", "else", "true", "false", "null", "await", "async", "new",
]);

const palette = {
  plain: colors.codeText,
  keyword: "#C792EA",
  string: "#C3E88D",
  comment: "#6B7F93",
  number: "#F78C6C",
  tag: "#82AAFF",
  prop: "#FFCB6B",
};

const TOKEN_REGEX =
  /(\/\/.*$|#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|(<\/?[A-Z][\w.]*|<\/?[a-z][\w-]*(?=[\s>/]))|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*(?==))|(\b[A-Za-z_$][\w$-]*\b)/gm;

/** Realce de sintaxe simples para TSX, JSON e shell — suficiente para slides. */
function tokenize(line: string, language: Props["language"]): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  for (const match of line.matchAll(TOKEN_REGEX)) {
    const index = match.index ?? 0;
    if (index > lastIndex) tokens.push({ text: line.slice(lastIndex, index), color: palette.plain });
    const [text, comment, str, tag, num, prop, word] = match;
    let color: string = palette.plain;
    if (comment && (language === "bash" ? text.startsWith("#") : text.startsWith("//"))) color = palette.comment;
    else if (comment) color = palette.plain;
    else if (str) color = palette.string;
    else if (tag) color = palette.tag;
    else if (num) color = palette.number;
    else if (prop) color = palette.prop;
    else if (word && KEYWORDS.has(word) && language !== "bash") color = palette.keyword;
    else if (word && language === "bash" && ["npx", "npm", "cd"].includes(word)) color = palette.keyword;
    tokens.push({ text, color });
    lastIndex = index + text.length;
  }
  if (lastIndex < line.length) tokens.push({ text: line.slice(lastIndex), color: palette.plain });
  return tokens;
}

type Props = {
  code: string;
  title?: string;
  language?: "tsx" | "json" | "bash";
  /** Linhas (1-based) a destacar. */
  highlight?: number[];
};

export function CodeBlock({ code, title, language = "tsx", highlight = [] }: Props) {
  const { fs } = useScale();
  const lines = code.replace(/\n$/, "").split("\n");
  const fontSize = fs(lines.length > 22 ? 12.5 : 14);

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <View style={[styles.dot, { backgroundColor: "#FF5F56" }]} />
          <View style={[styles.dot, { backgroundColor: "#FFBD2E" }]} />
          <View style={[styles.dot, { backgroundColor: "#27C93F" }]} />
          <Text style={[styles.title, { fontSize: fs(12) }]}>{title}</Text>
        </View>
      )}
      <ScrollView horizontal contentContainerStyle={styles.body}>
        <View>
          {lines.map((line, i) => (
            <View key={i} style={[styles.line, highlight.includes(i + 1) && styles.lineHighlight]}>
              <Text style={[styles.lineNumber, { fontSize, lineHeight: fontSize * 1.55 }]}>
                {String(i + 1).padStart(2, " ")}
              </Text>
              <Text style={{ fontFamily: fonts.mono, fontSize, lineHeight: fontSize * 1.55 }}>
                {tokenize(line, language).map((token, j) => (
                  <Text key={j} style={{ color: token.color }}>
                    {token.text}
                  </Text>
                ))}
                {line.length === 0 ? " " : null}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.codeBg, borderRadius: 12, overflow: "hidden" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#0A1622",
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  title: { color: "#9FB3C8", fontFamily: fonts.mono, marginLeft: 8 },
  body: { paddingVertical: 12, paddingRight: 16 },
  line: { flexDirection: "row", paddingLeft: 10 },
  lineHighlight: { backgroundColor: "rgba(224,159,62,0.18)", borderLeftWidth: 3, borderLeftColor: colors.road, paddingLeft: 7 },
  lineNumber: { color: "#4B6075", fontFamily: fonts.mono, marginRight: 14 },
});
