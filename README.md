# MapLibre Slides

Apresentação de 25 minutos sobre **MapLibre com Expo e React Native**, feita dentro de um app Expo, com uma **demonstração funcional** do `@maplibre/maplibre-react-native`.

| | Versão |
|---|---|
| Expo SDK | 58 |
| React Native | 0.88 (Nova Arquitetura) |
| @maplibre/maplibre-react-native | 11.5 |
| expo-router | 58 |

## Estrutura

```
src/
  app/                    rotas (Expo Router)
    _layout.tsx           Stack sem cabeçalho
    index.tsx             slides (aceita /?slide=N)
    demo.tsx              demonstração do mapa (rota independente)
  components/
    Presentation.tsx      navegação, progresso, sumário, notas, cronômetro
    CodeBlock.tsx         código com realce de sintaxe
    diagrams.tsx          diagramas e ilustração de mapa
    primitives.tsx        tópicos, callouts, cartões, links
  features/map-demo/
    MapDemo.tsx           mapa MapLibre: marcadores, câmera, linha, estilos
    MapDemo.web.tsx       aviso na web (o pacote é só nativo)
    places.ts             pontos de interesse e linha GeoJSON
    mapStyles.ts          URLs de estilo (OpenFreeMap / demotiles)
  slides/
    slides.tsx            conteúdo dos 16 slides + notas do apresentador
    snippets.ts           trechos de código mostrados nos slides
    info.ts               nomes, disciplina e instituição da capa
docs/ROTEIRO.md           cronograma, demonstração, plano B, perguntas e respostas
```

## Como executar

### Slides (navegador — ideal para o projetor)

```bash
npm install
npm run web
```

Atalhos: **← →** navegar · **N** notas · **S** sumário · **D** demonstração.

### Demonstração do mapa (Android/iOS — development build)

O MapLibre tem código nativo, então **não roda no Expo Go** nem no navegador.

```bash
# Android: requer Android Studio (SDK + emulador) ou celular com depuração USB
npx expo run:android

# iOS: requer macOS + Xcode
npx expo run:ios
```

Sem Android Studio ou Xcode, gere o build na nuvem com o EAS:

```bash
npx eas-cli@latest build:configure
npx eas-cli@latest build --profile development --platform android
```

Depois de instalado o build, no dia a dia basta rodar `npx expo start` e abrir o app **MapLibre Slides** no aparelho. Recompile só se mudar `app.json`, plugins ou dependências nativas.

Para abrir direto na demonstração: botão **Demo** no rodapé dos slides, ou `npx uri-scheme open maplibreslides://demo --android`.

## Verificações

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
npm run doctor      # expo-doctor
```

## Provedor de mapas

A demonstração usa os estilos públicos do [OpenFreeMap](https://openfreemap.org) (sem chave de API, dados © OpenStreetMap). O serviço **não oferece SLA**: serve para estudo e demonstração. Em produção, hospede os próprios tiles ou contrate um provedor. A atribuição é exibida automaticamente pelo mapa e não deve ser removida.
