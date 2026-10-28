import { useLocalSearchParams, useRouter } from "expo-router";

import { Presentation } from "@/components/Presentation";

export default function SlidesScreen() {
  const router = useRouter();
  // Permite abrir direto em um slide: /?slide=8 (numeração começa em 1).
  const { slide } = useLocalSearchParams<{ slide?: string }>();
  const initialIndex = slide ? Number(slide) - 1 || 0 : 0;
  return <Presentation initialIndex={initialIndex} onOpenDemo={() => router.push("/demo")} />;
}
