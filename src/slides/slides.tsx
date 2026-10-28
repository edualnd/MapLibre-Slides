import type { ReactNode } from "react";
import { Text, View } from "react-native";


import {
  appJsonSnippet,
  buildSnippet,
  firstMapSnippet,
  installSnippet,
  interactionsSnippet,
  markerSnippet,
} from "./snippets";
import { CodeBlock } from "@/components/CodeBlock";
import { LiveExample } from "@/components/LiveExample";
import {
  ComparisonTable,
  ComponentTree,
  CoordinateBadge,
  MapMock,
  MapStackDiagram,
} from "@/components/diagrams";
import {
  Bullets,
  Columns,
  Grid,
  InfoCard,
  P,
  Pill,
  PrimaryButton,
  Stack,
  SubTitle,
} from "@/components/primitives";
import { firstMapExample, interactionsExample, markersExample } from "./liveExamples";
import { colors } from "@/theme";

export type SlideContext = { openDemo: () => void; wide: boolean };

export type Slide = {
  id: string;
  section: number;
  title: string;
  kicker?: string;
  layout?: "cover";
  render: (ctx: SlideContext) => ReactNode;
};

export const sections = [
  { title: "Introdução e conceitos" },
  { title: "Ambiente e instalação" },
  { title: "Programação e demonstração" },
  { title: "Avaliação e encerramento" },
];

const demoPins = [
  { x: 30, y: 45, color: "#7B4FA0", label: "MASP", selected: true },
  { x: 22, y: 82, color: colors.park },
  { x: 60, y: 40, color: colors.water },
  { x: 70, y: 26, color: colors.road },
  { x: 62, y: 14, color: "#7B4FA0" },
];

export const slides: Slide[] = [
  /* ============================ PARTE 1 ============================ */
  {
    id: "capa",
    section: 0,
    title: "MapLibre: mapas interativos com Expo e React Native",
    layout: "cover",
    render: ({ wide }) => (
      <Columns ratio={[1.2, 1]}>
        <Stack gap={18}>
          <Pill label="Apresentação técnica" color={colors.road} />
          <Text style={{ fontSize: wide ? 52 : 34, fontWeight: "900", color: colors.ink, lineHeight: wide ? 60 : 40 }}>
            MapLibre: mapas interativos com Expo e React Native
          </Text>
          <P muted>
            O que é uma biblioteca de mapas, como o MapLibre funciona por dentro e como colocar um mapa com
            marcadores e interações em um app mobile — com uma demonstração ao vivo.
          </P>
        </Stack>
        <MapMock height={300} pins={demoPins} />
      </Columns>
    ),
  },
  {
    id: "o-que-e",
    section: 0,
    title: "O que é o MapLibre?",
    kicker: "Biblioteca open source de renderização de mapas",
    render: () => (
      <Columns ratio={[1.1, 1]}>
        <Bullets
          items={[
            "Conjunto de bibliotecas **open source** para **desenhar mapas interativos** (web e mobile).",
            "Nasceu em **dezembro de 2020** como fork comunitário do Mapbox GL, quando ele deixou de ser open source.",
            "Mantido pela comunidade e por empresas patrocinadoras — sem dono único.",
            "**MapLibre GL JS** (web), **MapLibre Native** (Android/iOS) e **MapLibre React Native** (o que usaremos).",
          ]}
        />
        <Grid columns={2}>
          {[
            <InfoCard key="1" icon="🧭" title="Turismo" accent={colors.water}>Pontos turísticos e roteiros</InfoCard>,
            <InfoCard key="2" icon="🚚" title="Logística" accent={colors.road}>Entregas e frotas</InfoCard>,
            <InfoCard key="3" icon="🏥" title="Serviços públicos" accent={colors.park}>Escolas, UBS, pontos de ônibus</InfoCard>,
            <InfoCard key="4" icon="📡" title="Monitoramento" accent={colors.alert}>Sensores e equipamentos</InfoCard>,
          ]}
        </Grid>
      </Columns>
    ),
  },
  {
    id: "como-funciona",
    section: 0,
    title: "Como funciona um mapa digital?",
    kicker: "Quem faz o quê",
    render: () => (
      <Stack gap={20}>
        <MapStackDiagram />
        <Columns ratio={[1, 1]}>
          <CoordinateBadge />
          <MapMock height={150} showTiles caption="Tiles: o mundo é dividido em quadrados por nível de zoom (z/x/y)." />
        </Columns>
      </Stack>
    ),
  },
  {
    id: "comparacao",
    section: 0,
    title: "MapLibre e outras bibliotecas de mapa",
    kicker: "Expo Maps, react-native-maps e Mapbox",
    render: () => (
      <ComparisonTable
        headers={["Critério", "MapLibre RN", "Expo Maps", "react-native-maps", "Mapbox (@rnmapbox/maps)"]}
        rows={[
          ["Motor do mapa", "MapLibre Native (próprio)", "Apple Maps (iOS) · Google Maps (Android)", "Apple Maps ou Google Maps", "Mapbox SDK"],
          ["Licença", "Open source", "Pacote aberto; mapas sob termos Apple/Google", "Pacote aberto; mapas sob termos Apple/Google", "SDK proprietário (termos Mapbox)"],
          ["Dados / tiles", "Você escolhe o provedor ou hospeda", "Apple / Google", "Apple / Google", "Plataforma Mapbox"],
          ["Chave / conta", "Depende do provedor (demo sem chave)", "Chave Google no Android; iOS sem chave", "Chave Google no Android; iOS sem chave", "Token Mapbox"],
          ["Personalização", "Total via Style Spec (JSON)", "Tipo de mapa, tema claro/escuro, estilo Google", "Estilo JSON do Google", "Alta (Mapbox Studio)"],
          ["Web", "Sim, com MapLibre GL JS", "Não", "Não", "Outra lib (Mapbox GL JS)"],
          ["No Expo Go", "Não (development build)", "Não (development build)", "Sim", "Não (development build)"],
        ]}
      />
    ),
  },

  /* ============================ PARTE 2 ============================ */
  {
    id: "instalacao",
    section: 1,
    title: "Requisitos e instalação",
    kicker: "Versões usadas neste projeto: Expo SDK 58 · React Native 0.88 · MapLibre RN 11.5",
    render: () => (
      <Columns ratio={[1, 1.25]}>
        <Stack gap={14}>
          <SubTitle>Requisitos</SubTitle>
          <Bullets
            items={[
              "**Node.js LTS** e um editor (VS Code).",
              "**Android**: Android Studio (SDK + emulador) ou celular com depuração USB.",
              "**iOS**: macOS + Xcode — ou build na nuvem com **EAS**.",
              "MapLibre RN **v11** exige **Nova Arquitetura**, React Native ≥ 0.80 e Expo ≥ 54.",
              "**Web**: este pacote **não** roda no navegador; a demo usa o `maplibre-gl` (MapDemo.web.tsx).",
            ]}
            color={colors.road}
          />
          <CodeBlock title="app.json — config plugin" language="json" code={appJsonSnippet} />
        </Stack>
        <Stack gap={12}>
          <CodeBlock title="terminal — instalação" language="bash" code={installSnippet} />
          <CodeBlock title="terminal — build" language="bash" code={buildSnippet} />
        </Stack>
      </Columns>
    ),
  },
  {
    id: "configuracao",
    section: 1,
    title: "Configuração inicial do mapa",
    kicker: "Estilo e problemas comuns",
    render: () => (
      <Columns ratio={[1, 1]}>
        <Stack gap={14}>
          <SubTitle>Escolhendo um estilo válido</SubTitle>
          <Bullets
            items={[
              "`mapStyle` recebe a **URL de um style.json** (ou o próprio objeto JSON).",
              "Demo: **OpenFreeMap** `tiles.openfreemap.org/styles/liberty` — sem chave, dados OpenStreetMap, **sem SLA**.",
              "`demotiles.maplibre.org` é só um mapa-múndi simples, útil para testes.",
              "Provedores com chave (MapTiler, Stadia, etc.) têm planos e termos próprios.",
              "A **atribuição** (© OpenStreetMap…) é obrigatória — não esconda o botão ⓘ.",
            ]}
          />
        </Stack>
        <Stack gap={10}>
          <SubTitle color={colors.alert}>Problemas comuns</SubTitle>
          <Grid columns={1}>
            {[
              <InfoCard key="1" title="Abriu no Expo Go" accent={colors.alert}>
                {"Erro de módulo nativo não encontrado → use o development build."}
              </InfoCard>,
              <InfoCard key="2" title="Mapa em branco/cinza" accent={colors.alert}>
                {"URL de estilo inválida ou sem internet → trate `onDidFailLoadingMap`."}
              </InfoCard>,
              <InfoCard key="3" title="Ponto no oceano" accent={colors.alert}>
                {"Coordenadas invertidas → use **[lng, lat]**."}
              </InfoCard>,
              <InfoCard key="4" title="Adicionou plugin e nada mudou" accent={colors.alert}>
                {"Plugins só valem após **recompilar** (`expo run:*` ou EAS)."}
              </InfoCard>,
            ]}
          </Grid>
        </Stack>
      </Columns>
    ),
  },

  /* ============================ PARTE 3 ============================ */
  {
    id: "gl-js",
    section: 2,
    title: "Código nativo, mapa ao vivo com GL JS",
    kicker: "Como os exemplos a seguir funcionam",
    render: () => (
      <Columns ratio={[1, 1.15]}>
        <Bullets
          items={[
            "O código dos próximos slides é **@maplibre/maplibre-react-native** — o mesmo que roda no app **Android/iOS**.",
            "Esse pacote **não roda no navegador**. Por isso o mapa ao lado de cada código é desenhado com o **MapLibre GL JS**, a versão **web** da mesma família.",
            "Mesma **Style Spec**, mesmos estilos e tiles: o resultado no mapa é o mesmo.",
            "O código GL JS também **não roda no Android/iOS** (depende do navegador). O app da demo faz igual: `MapDemo.tsx` no celular e `MapDemo.web.tsx` na web.",
          ]}
        />
        <ComparisonTable
          headers={["Conceito", "React Native (código dos slides)", "GL JS (mapa ao vivo)"]}
          rows={[
            ["Mapa + estilo", "<Map mapStyle={...}>", "new maplibregl.Map({ container, style })"],
            ["Posição inicial", "<Camera initialViewState>", "center e zoom nas opções"],
            ["Animar a câmera", "cameraRef.current.flyTo(...)", "map.flyTo({ center, zoom })"],
            ["Marcador", "<Marker lngLat={...}>", "new maplibregl.Marker().setLngLat()"],
            ["Linha / área", "<GeoJSONSource> + <Layer>", "map.addSource() + map.addLayer()"],
            ["Eventos", "onPress / onLongPress / onRegionDidChange", "map.on(\"click\" | \"moveend\")"],
          ]}
        />
      </Columns>
    ),
  },
  {
    id: "primeiro-mapa",
    section: 2,
    title: "Criando o primeiro mapa",
    kicker: "20 linhas para um mapa funcional",
    render: () => (
      <LiveExample
        title="PrimeiroMapa.tsx"
        code={firstMapSnippet}
        highlight={[1, 5, 9, 10, 11, 12, 13, 14]}
        example={firstMapExample}
      />
    ),
  },
  {
    id: "componentes",
    section: 2,
    title: "Entendendo os componentes",
    kicker: "API do @maplibre/maplibre-react-native v11",
    render: () => (
      <Columns ratio={[1.1, 1]}>
        <ComponentTree />
        <Bullets
          items={[
            "**Coordenada**: tipo `LngLat` = `[longitude, latitude]`.",
            "**Marker**: renderiza uma View do React Native — ótimo para **poucos** pontos com visual livre.",
            "**GeoJSONSource + Layer**: desenhado pela GPU — indicado para **muitos** pontos, linhas e áreas.",
            "**Camera** via `ref`: `flyTo`, `easeTo`, `zoomTo`, `fitBounds`.",
          ]}
        />
      </Columns>
    ),
  },
  {
    id: "marcadores",
    section: 2,
    title: "Adicionando marcadores",
    kicker: "Dados → marcadores → toque → informações",
    render: () => (
      <LiveExample title="MapDemo.tsx — marcadores" code={markerSnippet} highlight={[4, 5, 6, 12, 15, 16, 17]} example={markersExample} />
    ),
  },
  {
    id: "interacoes",
    section: 2,
    title: "Interações com o mapa",
    kicker: "Câmera, zoom, eventos e uma linha de roteiro",
    render: () => (
      <LiveExample title="MapDemo.tsx — interações" code={interactionsSnippet} highlight={[2, 3, 10, 11, 14, 15, 16]} example={interactionsExample} />
    ),
  },
  {
    id: "demo",
    section: 2,
    title: "Demonstração ao vivo",
    kicker: "Android · iOS · Web",
    render: ({ openDemo }) => (
      <Columns ratio={[1, 1]}>
        <Stack gap={14}>
          {[
            "Mapa carregado e a atribuição ⓘ",
            "Arrastar, pinça para zoom, botões + / −",
            "Tocar no marcador do MASP",
            "Painel com nome, categoria e coordenadas",
            "Ver todos · linha do roteiro · trocar estilo",
          ].map((step, i) => (
            <View key={step} style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.water, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>{i + 1}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 17, color: colors.ink }}>{step}</Text>
            </View>
          ))}
          <PrimaryButton label="▶  Abrir demonstração" onPress={openDemo} />
        </Stack>
        <MapMock height={220} pins={demoPins} />
      </Columns>
    ),
  },

  /* ============================ PARTE 4 ============================ */
  {
    id: "vantagens",
    section: 3,
    title: "Vantagens do MapLibre",
    render: () => (
      <Grid columns={3}>
        {[
          <InfoCard key="1" icon="🔓" title="Código aberto" accent={colors.park}>Licenças permissivas; dá para ler, auditar e contribuir.</InfoCard>,
          <InfoCard key="2" icon="🎨" title="Personalização" accent={colors.park}>Estilo inteiro em JSON: cores, camadas, rótulos, fontes.</InfoCard>,
          <InfoCard key="3" icon="🔌" title="Provedor à escolha" accent={colors.park}>Qualquer fonte compatível: pública, comercial ou própria.</InfoCard>,
          <InfoCard key="4" icon="🧩" title="Sem dono único" accent={colors.park}>A biblioteca não obriga a usar uma plataforma comercial específica.</InfoCard>,
          <InfoCard key="5" icon="⚡" title="Renderização vetorial" accent={colors.park}>GPU, rotação, inclinação e zoom suave.</InfoCard>,
          <InfoCard key="6" icon="📦" title="Recursos avançados" accent={colors.park}>Mapas offline, camadas de dados, clusters.</InfoCard>,
        ]}
      </Grid>
    ),
  },
  {
    id: "desvantagens",
    section: 3,
    title: "Desvantagens e limitações",
    render: () => (
      <Grid columns={3}>
        {[
          <InfoCard key="1" icon="⚙️" title="Configuração inicial" accent={colors.alert}>Escolher estilo, provedor, termos e atribuição.</InfoCard>,
          <InfoCard key="2" icon="📱" title="Sem Expo Go" accent={colors.alert}>Exige development build e recompilação ao mudar código nativo.</InfoCard>,
          <InfoCard key="3" icon="🌐" title="Web separada" accent={colors.alert}>Na web é outra biblioteca (MapLibre GL JS), com API própria.</InfoCard>,
          <InfoCard key="4" icon="📚" title="Curva de aprendizado" accent={colors.alert}>Style Spec, sources, layers e expressões.</InfoCard>,
          <InfoCard key="5" icon="🛰️" title="Dependência de provedores" accent={colors.alert}>Se o servidor de tiles cair, o mapa não carrega.</InfoCard>,
          <InfoCard key="6" icon="🏗️" title="Infraestrutura em escala" accent={colors.alert}>Tiles, banda e servidores passam a ser responsabilidade sua.</InfoCard>,
          <InfoCard key="7" icon="🐢" title="Desempenho" accent={colors.alert}>Muitos `Marker` (Views) pesam em aparelhos simples — prefira layers.</InfoCard>,
          <InfoCard key="8" icon="📜" title="Serviços externos" accent={colors.alert}>Têm limites e termos: uso justo, atribuição, cache.</InfoCard>,
          <InfoCard key="9" icon="🔎" title="Ecossistema menor" accent={colors.alert}>Menos exemplos prontos que o do Google Maps.</InfoCard>,
        ]}
      </Grid>
    ),
  },
  {
    id: "quando-usar",
    section: 3,
    title: "Quando utilizar MapLibre?",
    render: () => (
      <Columns ratio={[1.3, 1]}>
        <Stack gap={10}>
          <SubTitle color={colors.park}>Bons cenários</SubTitle>
          <Grid columns={2}>
            {[
              <InfoCard key="1" icon="🧭" title="Turismo" accent={colors.park}>Roteiros e mapas temáticos com identidade visual própria.</InfoCard>,
              <InfoCard key="2" icon="🏪" title="Estabelecimentos" accent={colors.park}>Localizar lojas, agências, pontos de coleta.</InfoCard>,
              <InfoCard key="3" icon="🚚" title="Entregas" accent={colors.park}>Visualizar pedidos e entregadores (rotas via serviço externo).</InfoCard>,
              <InfoCard key="4" icon="📡" title="Monitoramento" accent={colors.park}>Equipamentos, sensores, frotas em tempo real.</InfoCard>,
              <InfoCard key="5" icon="🏫" title="Serviços públicos" accent={colors.park}>Escolas, UBS, pontos de ônibus com dados abertos.</InfoCard>,
              <InfoCard key="6" icon="🎨" title="Mapas personalizados" accent={colors.park}>Indoor, campus, eventos, offline.</InfoCard>,
            ]}
          </Grid>
        </Stack>
        <Stack gap={10}>
          <SubTitle color={colors.road}>Quando outra opção pode ser melhor</SubTitle>
          <Bullets
            color={colors.road}
            items={[
              "Precisa testar no **Expo Go** ou entregar rápido → `react-native-maps`.",
              "Quer o mapa **nativo do sistema** (Apple Maps / Google Maps) com API do Expo → **Expo Maps**.",
              "Depende de **Places, Street View** ou busca da Google → Google Maps.",
              "Quer **dados + busca + rotas** integrados de um fornecedor → Mapbox ou similares.",
              "Mapa **apenas decorativo** → imagem estática pode bastar.",
            ]}
          />
        </Stack>
      </Columns>
    ),
  },
  {
    id: "conclusao",
    section: 3,
    title: "Conclusão",
    render: () => (
      <Columns ratio={[1, 1]}>
        <Stack gap={14}>
          <SubTitle>Principais aprendizados</SubTitle>
          <Bullets
            items={[
              "**Biblioteca** (MapLibre) desenha; **dados** (OpenStreetMap, GeoJSON) informam; **serviços** (tiles, busca, rotas) entregam.",
              "Coordenadas em **[longitude, latitude]**.",
              "No Expo: **development build** + config plugin; sem Expo Go.",
              "`Map` + `Camera` + `Marker` + `GeoJSONSource`/`Layer` cobrem a maioria dos casos.",
              "Open source ≠ custo zero: avalie provedor, termos e atribuição.",
            ]}
          />
        </Stack>
        <View style={{ backgroundColor: colors.ink, borderRadius: 14, padding: 18 }}>
          <Text style={{ color: colors.roadLight, fontWeight: "800", fontSize: 14 }}>PERGUNTA PARA A TURMA</Text>
          <Text style={{ color: "#fff", fontSize: 21, fontWeight: "800", marginTop: 6 }}>
            Que app da nossa cidade ou faculdade ficaria melhor com um mapa próprio — e de onde viriam os dados?
          </Text>
        </View>
      </Columns>
    ),
  },
];
