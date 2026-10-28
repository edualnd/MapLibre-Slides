import { useRouter } from "expo-router";

import { MapDemo } from "@/features/map-demo/MapDemo";

/**
 * Rota independente da demonstração: pode ser aberta direto, sem passar pelos
 * slides (ex.: npx uri-scheme open maplibreslides://demo --android).
 */
export default function DemoScreen() {
  const router = useRouter();
  return <MapDemo onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))} />;
}
