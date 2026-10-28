import { useEffect, useRef, useState } from "react";
import { Modal, Platform, Pressable, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useScale } from "./useScale";
import { sections, slides } from "@/slides/slides";
import { colors, sectionColors } from "@/theme";

type Props = { onOpenDemo: () => void; initialIndex?: number };

export function Presentation({ onOpenDemo, initialIndex = 0 }: Props) {
  const { wide, fs } = useScale();
  const [index, setIndex] = useState(Math.max(0, Math.min(slides.length - 1, initialIndex)));
  const [showSummary, setShowSummary] = useState(false);
  const scrollRef = useRef<ScrollViewInstance>(null);

  const slide = slides[index];
  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    setIndex(clamped);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  // Atalhos de teclado na web: ← → navegam, S abre o sumário, D abre a demo.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const onKey = (event: KeyboardEvent) => {
      // Não navegar enquanto a pessoa digita no editor de código.
      const target = event.target as HTMLElement | null;
      if (target?.closest("textarea, input, [contenteditable]")) return;
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") goTo(index + 1);
      else if (event.key === "ArrowLeft" || event.key === "PageUp") goTo(index - 1);
      else if (event.key.toLowerCase() === "s") setShowSummary((v) => !v);
      else if (event.key.toLowerCase() === "d") onOpenDemo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const sectionColor = sectionColors[slide.section];
  const isCover = slide.layout === "cover";

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom", "left", "right"]}>
      {/* Cabeçalho: seção atual e progresso por seção */}
      <View style={[styles.header, { paddingHorizontal: wide ? 40 : 16 }]}>
        <Pressable onPress={() => setShowSummary(true)} style={styles.sectionButton}>
          <View style={[styles.sectionDot, { backgroundColor: sectionColor }]} />
          <Text style={[styles.sectionText, { fontSize: fs(13) }]} numberOfLines={1}>
            Parte {slide.section + 1} · {sections[slide.section].title}
          </Text>
          <Text style={[styles.summaryHint, { fontSize: fs(12) }]}>☰ Sumário</Text>
        </Pressable>
        <View style={styles.progress}>
          {slides.map((s, i) => (
            <Pressable
              key={s.id}
              onPress={() => goTo(i)}
              style={[
                styles.progressSegment,
                { flex: 1, backgroundColor: i <= index ? sectionColors[s.section] : colors.line },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView
          ref={scrollRef}
          style={styles.slideScroll}
          contentContainerStyle={[
            styles.slideContent,
            { paddingHorizontal: wide ? 56 : 18 },
            isCover && styles.coverContent,
          ]}
        >
          {!isCover && (
            <View style={{ marginBottom: fs(22) }}>
              {slide.kicker && (
                <Text style={[styles.kicker, { color: sectionColor, fontSize: fs(14) }]}>{slide.kicker}</Text>
              )}
              <Text style={[styles.title, { fontSize: fs(wide ? 38 : 30) }]}>{slide.title}</Text>
              <View style={[styles.titleRule, { backgroundColor: sectionColor }]} />
            </View>
          )}
          {slide.render({ openDemo: onOpenDemo, wide })}
        </ScrollView>
      </View>

      {/* Rodapé de navegação */}
      <View style={[styles.footer, { paddingHorizontal: wide ? 40 : 12 }]}>
        <Pressable
          onPress={() => goTo(index - 1)}
          disabled={index === 0}
          style={[styles.navButton, index === 0 && styles.navDisabled]}
          accessibilityLabel="Slide anterior"
        >
          <Text style={styles.navText}>{wide ? "‹ Anterior" : "‹"}</Text>
        </Pressable>

        <View style={styles.footerCenter}>
          <Text style={[styles.counter, { fontSize: fs(15) }]}>
            {index + 1} / {slides.length}
          </Text>
        </View>

        <View style={styles.footerRight}>
          <Pressable onPress={onOpenDemo} style={styles.toolButton}>
            <Text style={styles.toolText}>Demo</Text>
          </Pressable>
          <Pressable
            onPress={() => goTo(index + 1)}
            disabled={index === slides.length - 1}
            style={[styles.navButton, styles.navPrimary, index === slides.length - 1 && styles.navDisabled]}
            accessibilityLabel="Próximo slide"
          >
            <Text style={[styles.navText, { color: "#fff" }]}>{wide ? "Próximo ›" : "›"}</Text>
          </Pressable>
        </View>
      </View>

      <SummaryModal
        visible={showSummary}
        current={index}
        onClose={() => setShowSummary(false)}
        onSelect={(i) => {
          goTo(i);
          setShowSummary(false);
        }}
      />
    </SafeAreaView>
  );
}

function SummaryModal({
  visible,
  current,
  onClose,
  onSelect,
}: {
  visible: boolean;
  current: number;
  onClose: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <ScrollView contentContainerStyle={{ padding: 22, gap: 16 }}>
            <Text style={styles.modalTitle}>Sumário</Text>
            {sections.map((section, s) => (
              <View key={section.title} style={{ gap: 4 }}>
                <Text style={[styles.modalSection, { color: sectionColors[s] }]}>
                  Parte {s + 1} — {section.title}
                </Text>
                {slides.map((slide, i) =>
                  slide.section === s ? (
                    <Pressable
                      key={slide.id}
                      onPress={() => onSelect(i)}
                      style={[styles.modalItem, i === current && { backgroundColor: colors.paperDeep }]}
                    >
                      <Text style={styles.modalItemNumber}>{i + 1}</Text>
                      <Text style={styles.modalItemText}>{slide.title}</Text>
                    </Pressable>
                  ) : null,
                )}
              </View>
            ))}
            <Text style={styles.modalHint}>Atalhos na web: ← → navegar · S sumário · D demo</Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  header: { paddingTop: 10, gap: 8 },
  sectionButton: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionDot: { width: 10, height: 10, borderRadius: 5 },
  sectionText: { flex: 1, color: colors.inkSoft, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },
  summaryHint: { color: colors.water, fontWeight: "700" },
  progress: { flexDirection: "row", gap: 3, height: 5 },
  progressSegment: { borderRadius: 3 },
  body: { flex: 1 },
  slideScroll: { flex: 1 },
  slideContent: { paddingTop: 24, paddingBottom: 32, maxWidth: 1400, width: "100%", alignSelf: "center" },
  coverContent: { flexGrow: 1, justifyContent: "center" },
  kicker: { fontWeight: "800", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  title: { fontWeight: "900", color: colors.ink },
  titleRule: { width: 64, height: 5, borderRadius: 3, marginTop: 10 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    gap: 8,
  },
  footerCenter: { alignItems: "center", flexShrink: 1 },
  footerRight: { flexDirection: "row", gap: 6, alignItems: "center" },
  counter: { fontWeight: "800", color: colors.ink },
  navButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  navPrimary: { backgroundColor: colors.ink },
  navDisabled: { opacity: 0.3 },
  navText: { fontWeight: "800", color: colors.ink },
  toolButton: { paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.line },
  toolText: { fontWeight: "700", color: colors.inkSoft, fontSize: 13 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(19,41,61,0.5)", alignItems: "center", justifyContent: "center", padding: 16 },
  modalCard: { backgroundColor: colors.card, borderRadius: 16, maxWidth: 620, width: "100%", maxHeight: "90%" },
  modalTitle: { fontSize: 22, fontWeight: "900", color: colors.ink },
  modalSection: { fontWeight: "800", fontSize: 14, textTransform: "uppercase" },
  modalItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 7, paddingHorizontal: 8, borderRadius: 8 },
  modalItemNumber: { width: 22, color: colors.inkMuted, fontWeight: "800" },
  modalItemText: { flex: 1, color: colors.ink, fontSize: 15 },
  modalHint: { color: colors.inkMuted, fontSize: 12 },
});
