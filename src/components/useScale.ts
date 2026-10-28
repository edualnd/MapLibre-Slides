import { useWindowDimensions } from "react-native";

/** Ajusta tamanhos ao espaço disponível: projetor/notebook (largo) ou celular. */
export function useScale() {
  const { width, height } = useWindowDimensions();
  const wide = width >= 900;
  const factor = wide ? Math.min(1.25, Math.max(1, Math.min(width / 1280, height / 760))) : 0.85;
  return { wide, width, fs: (size: number) => Math.round(size * factor) };
}
