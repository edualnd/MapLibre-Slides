import { Platform } from "react-native";

/**
 * Paleta inspirada em cartografia: papel, tinta, água, vegetação e vias.
 */
export const colors = {
  paper: "#F5F1E8",
  paperDeep: "#ECE5D5",
  card: "#FFFFFF",
  ink: "#13293D",
  inkSoft: "#4A5D70",
  inkMuted: "#7A8A99",
  line: "#D9D1BF",
  water: "#2A6F97",
  waterLight: "#A9CCE3",
  park: "#2F855A",
  parkLight: "#B7DEC4",
  road: "#E09F3E",
  roadLight: "#F6D9A8",
  alert: "#B23A48",
  alertLight: "#F4D3D7",
  codeBg: "#0F1E2C",
  codeText: "#E3EAF1",
} as const;

/** Cor de cada parte da apresentação (usada no sumário e na barra de progresso). */
export const sectionColors = [colors.water, colors.road, colors.park, colors.alert] as const;

export const fonts = {
  mono: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  }),
};

export const radius = { sm: 6, md: 10, lg: 16 } as const;
