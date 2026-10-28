# Roteiro da apresentação — MapLibre com Expo e React Native

Duração total: **25 minutos**. As notas completas de cada slide (o que explicar, o que enfatizar, exemplo e transição) estão dentro do app: botão **Notas** no rodapé ou tecla **N** na web.

## 1. Cronograma

| # | Slide | Início | Duração |
|---:|---|---:|---:|
| | **Parte 1 — Introdução e conceitos** | | **4:00** |
| 1 | Capa | 0:00 | 0:30 |
| 2 | O que é o MapLibre? | 0:30 | 1:15 |
| 3 | Como funciona um mapa digital? | 1:45 | 1:15 |
| 4 | MapLibre, Mapbox e Google Maps | 3:00 | 1:00 |
| | **Parte 2 — Ambiente e instalação** | | **5:00** |
| 5 | O que é Expo e por que utilizá-lo? | 4:00 | 1:30 |
| 6 | Requisitos e instalação | 5:30 | 2:00 |
| 7 | Configuração inicial do mapa | 7:30 | 1:30 |
| | **Parte 3 — Programação e demonstração** | | **9:00** |
| 8 | Criando o primeiro mapa | 9:00 | 1:30 |
| 9 | Entendendo os componentes | 10:30 | 1:30 |
| 10 | Adicionando marcadores | 12:00 | 1:30 |
| 11 | Interações com o mapa | 13:30 | 1:30 |
| 12 | Demonstração ao vivo | 15:00 | 3:00 |
| | **Parte 4 — Avaliação e encerramento** | | **7:00** |
| 13 | Vantagens do MapLibre | 18:00 | 1:30 |
| 14 | Desvantagens e limitações | 19:30 | 2:00 |
| 15 | Quando utilizar MapLibre? | 21:30 | 1:30 |
| 16 | Conclusão e referências | 23:00 | 2:00 |

O rodapé do app mostra o cronômetro real e a janela prevista no roteiro para o slide atual. Se estiver mais de 1 minuto atrasado ao chegar no slide 12, encurte a demonstração para os passos 2, 4 e 5.

### Checkpoints de tempo

- **4:00** → entrando no slide 5 (Expo)
- **9:00** → entrando no slide 8 (primeiro mapa)
- **15:00** → abrindo a demonstração
- **18:00** → de volta aos slides, na parte de vantagens
- **23:00** → conclusão

## 2. Resumo da fala por slide

1. **Capa** — Apresentar o grupo e o roteiro. Perguntar quem já usou um app com mapa. *Transição:* "Mas afinal, o que é o MapLibre?"
2. **O que é** — Família de bibliotecas open source para renderizar mapas; fork do Mapbox GL em 2020. Biblioteca ≠ app de mapas. *Analogia:* player de vídeo × vídeos.
3. **Como funciona** — Tiles + estilo + seus dados → MapLibre desenha → o app controla câmera e marcadores. O MapLibre não fornece dados, busca nem rotas. Coordenadas em **[lng, lat]**.
4. **Comparação** — Separar licença da biblioteca, custo dos serviços e termos do provedor. Nenhuma opção é "sempre grátis" ou "sempre melhor".
5. **Expo** — Expo Go não tem o MapLibre; é preciso um development build. Recompilar só quando muda código nativo ou plugin.
6. **Instalação** — `npx expo install`, config plugin, `expo run:android`. Atenção para não misturar a v10 com a v11.
7. **Configuração** — Estilo = style.json; OpenFreeMap sem chave e sem SLA; atribuição obrigatória; problemas comuns.
8. **Primeiro mapa** — Importar, definir o estilo, `<Map>`, `<Camera initialViewState>`. Zoom 12 = cidade.
9. **Componentes** — Map, Camera, Marker, GeoJSONSource + Layer. Marker para poucos pontos; Layer para muitos.
10. **Marcadores** — Dados separados da interface; `onPress` → estado → painel; `flyTo` move a câmera.
11. **Interações** — `zoomTo`, `fitBounds`, `onRegionDidChange`, `onLongPress`, linha GeoJSON. Desenhar uma linha ≠ calcular uma rota.
12. **Demo** — Seguir os 7 passos que aparecem na tela (seção 3).
13. **Vantagens** — Controle, personalização, provedor à escolha. Mas sem custo zero.
14. **Limitações** — Configuração, sem Expo Go, sem web, dependência de provedor, desempenho de muitos Markers.
15. **Quando usar** — Mapa central e personalizado → MapLibre. Mapa coadjuvante e prazo curto → solução mais pronta.
16. **Conclusão** — Biblioteca × dados × serviços. Pergunta para a turma. Abrir para perguntas.

## 3. Demonstração ao vivo (≈ 3 min)

**Preparação (antes da aula):**

- [ ] Development build instalado no celular ou no emulador (`npx expo run:android`).
- [ ] `npx expo start` rodando, com o celular na mesma rede Wi-Fi (ou cabo USB + `adb reverse`).
- [ ] App aberto uma vez com internet, para os tiles da região ficarem no cache do aparelho.
- [ ] Espelhamento de tela testado (scrcpy, AirPlay ou o próprio emulador no projetor).
- [ ] Vídeo do plano B gravado e aberto em outra aba.

**Roteiro:**

| Tempo | Ação | O que falar |
|---:|---|---|
| 0:00 | Abrir o app → botão **Demo** | "Esta tela é independente dos slides: rota `/demo`." |
| 0:20 | Mapa carregado; tocar no ⓘ | "Estilo Liberty do OpenFreeMap; o crédito ao OpenStreetMap é obrigatório." |
| 0:40 | Arrastar, pinça, botões + / − | "O painel no topo mostra zoom e centro vindos do `onRegionDidChange`." |
| 1:20 | Tocar no marcador do **MASP** | "`onPress` do Marker chama `selectPlace`." |
| 1:40 | Painel inferior com os dados | "É estado do React: `selectedPlace`. A câmera voou com `flyTo`." |
| 2:00 | **Ver todos** → **Mostrar linha** → trocar para **Positron** | "`fitBounds`; GeoJSONSource + Layer; trocar o estilo é trocar uma URL." |
| 2:30 | Voltar aos slides 10 e 11 | Apontar no código cada coisa que apareceu. |

Extra, se sobrar tempo: toque longo em qualquer lugar mostra a coordenada `[lng, lat]`.

## 4. Plano B (mapa não carrega)

1. **Sem internet:** a faixa vermelha "Não foi possível carregar o estilo" aparece (`onDidFailLoadingMap`). Use isso como exemplo real da dependência de provedor (slide 14). Tente o 4G do celular.
2. **Um estilo fora do ar:** troque para **Demo MapLibre** no seletor do topo (servidor diferente).
3. **Build não abre / sem aparelho:** passe o **vídeo gravado antes**. Para gravar:
   - Android físico: `adb shell screenrecord /sdcard/demo.mp4` (pare com Ctrl+C) e `adb pull /sdcard/demo.mp4`.
   - Emulador: botão ⋯ → *Record and playback*.
   - Ou use a gravação de tela nativa do Android ou do iOS.
4. **Nada funciona:** fique no slide 12 (ilustração do mapa) e explique o fluxo pelos slides 10 e 11. O código mostrado é o mesmo da demonstração.

## 5. Erros comuns durante a demonstração

| Sintoma | Causa provável | Solução |
|---|---|---|
| Erro de módulo nativo não encontrado | App aberto no **Expo Go** | Abrir o development build instalado |
| Tela cinza ou em branco | Sem internet ou URL de estilo inválida | Trocar de rede ou de estilo; verificar a faixa de erro |
| Marcador no oceano | Coordenadas na ordem `[lat, lng]` | Usar `[lng, lat]` |
| Mudou o `app.json` e nada mudou | Plugin só vale após recompilar | `npx expo run:android` de novo |
| App não encontra o servidor | Celular e PC em redes diferentes | Mesma rede, ou `npx expo start --tunnel`, ou cabo USB |
| Build Android falha no Gradle | SDK ou JDK ausente ou incompatível | Abrir o Android Studio, instalar o SDK e usar o JDK que ele traz; ou EAS Build |
| Mapa lento com muitos pontos | Muitos `Marker` (Views) | Usar `GeoJSONSource` + `Layer` do tipo `circle`/`symbol` |
| Rótulos do mapa somem ao trocar o estilo | Estilo ainda carregando | Aguardar "Carregando estilo…" sumir |

## 6. Perguntas prováveis do professor (com respostas)

**1. O MapLibre é gratuito?**
A biblioteca é open source (MapLibre React Native: MIT; MapLibre Native: BSD-2-Clause), então não se paga licença para usá-la. Mas o mapa precisa de tiles, e quem os serve pode cobrar ou impor limites. Busca de endereços e rotas também são serviços à parte.

**2. Qual a diferença para o Mapbox?**
O MapLibre nasceu como fork do Mapbox GL JS 1.13 (BSD), em dezembro de 2020, quando a versão 2 passou a ter licença proprietária. Hoje são projetos independentes, com APIs que divergiram. O Mapbox integra biblioteca, dados e serviços sob conta e token; no MapLibre você escolhe o provedor.

**3. Por que não funciona no Expo Go?**
O Expo Go só contém os módulos nativos incluídos no Expo SDK. O MapLibre tem código nativo próprio (MapLibre Native em C++, com bindings Java/Kotlin e Swift/Obj-C), então precisa de um development build, que é um app compilado com esse código.

**4. Por que não usaram o react-native-maps?**
Ele é ótimo para começar (roda até no Expo Go), mas usa os mapas do Google (Android) e da Apple (iOS por padrão), com estilização limitada e chave do Google para publicar. O MapLibre dá controle total do estilo e liberdade de provedor — e esse era o objetivo do trabalho.

**5. O que é um tile?**
É um quadrado do mapa (raster = imagem; vetorial = geometrias) identificado por zoom/x/y. Em cada nível de zoom, o mundo se divide em 4ⁿ tiles, e só baixamos os que estão visíveis.

**6. Qual a diferença entre tile vetorial e raster?**
O raster é uma imagem pronta: fácil, mas sem como mudar cores nem girar rótulos. O vetorial traz geometrias e atributos, e o MapLibre desenha no aparelho conforme o estilo, permitindo mudar o visual, girar e inclinar sem baixar de novo.

**7. O app funciona offline?**
A biblioteca tem `OfflineManager` para baixar regiões, mas é preciso respeitar os termos do provedor. O OpenFreeMap, por exemplo, limita cada download a 3.000 tiles ou 50 MB. A demonstração não implementa o modo offline.

**8. Como calcular uma rota de verdade?**
Com um serviço de roteamento (OSRM, Valhalla, GraphHopper ou APIs comerciais), que recebe origem e destino e devolve uma LineString. O MapLibre só desenha essa linha com `GeoJSONSource` + `Layer type="line"`.

**9. Como mostrar a localização do usuário?**
Pedindo permissão de localização em tempo de execução (por exemplo, com `expo-location`) e usando o componente `UserLocation` ou `NativeUserLocation` da biblioteca, ou `trackUserLocation` na `Camera`. Não implementamos isso na demonstração.

**10. Marker ou Layer: quando usar cada um?**
O `Marker` é uma View React Native posicionada no mapa: visual livre, mas custo alto por item, então serve para poucas dezenas. O `Layer` (circle/symbol) é desenhado pela GPU e aguenta milhares de pontos, além de oferecer clusters.

**11. Por que [longitude, latitude] e não o contrário?**
Porque o padrão GeoJSON (RFC 7946) usa a ordem x, y, ou seja, longitude, latitude. O Google Maps e muitos sites exibem "lat, lng", e daí vem a confusão.

**12. Dá para usar em produção com o OpenFreeMap?**
Tecnicamente sim, mas o próprio projeto diz que não oferece SLA. Para um produto real: hospedar os próprios tiles (por exemplo, arquivos PMTiles ou OpenMapTiles), contratar um provedor ou usar o OpenFreeMap com plano de contingência.

**13. O que muda entre a v10 e a v11 do MapLibre React Native?**
A v11 exige Nova Arquitetura e renomeou a API: `MapView` → `Map`, `PointAnnotation` → `ViewAnnotation`, `ShapeSource` → `GeoJSONSource`, camadas específicas → `<Layer type=...>`, `centerCoordinate`/`zoomLevel` → `center`/`zoom`, `styleURL` → `mapStyle`.

**14. E na web?**
Este pacote não tem implementação web. Na web, usa-se o MapLibre GL JS (`maplibre-gl`), com uma API diferente. No projeto, a tela `/demo` tem um arquivo `.web.tsx` que explica isso em vez de quebrar.

## 7. Checklist do dia

- [ ] Nomes, disciplina e instituição preenchidos em `src/slides/info.ts`
- [ ] Slides abertos no notebook (`npm run web`) em tela cheia (F11)
- [ ] Celular com o build, carregado e com a tela espelhada
- [ ] Vídeo do plano B pronto
- [ ] Cronômetro: começa sozinho ao sair da capa
