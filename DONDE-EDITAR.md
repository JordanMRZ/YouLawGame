# Dónde editar cada cosa — Word Bridge 3D

Mapa rápido del repo. Casi todo el contenido de niveles se escribe en datos; el código 3D solo cambia si quieres un comportamiento nuevo.

La pista avanza en **+Z**. Izquierda/derecha es **X**. Altura es **Y**.

---

## Quiero cambiar…

| Qué | Archivo |
| --- | --- |
| Preguntas, frases, respuestas, layout del nivel | `src/data/levels/level01.ts` … `level10.ts` |
| Explicación al fallar | `src/data/explanations.ts` |
| Segundos del cronómetro | `timeLimit` en el `challenge()` o default 15 en `src/data/trackBuilder.ts` |
| Nombre, subtítulo y tema que se ven en el hub | `src/data/levels.ts` **y** el `b.build({...})` de ese nivel |
| Colores del cielo, niebla, agua y suelo | `src/data/worlds.ts` |
| Cómo se construye la pista (`pad`, `barrier`, `challenge`…) | `src/data/trackBuilder.ts` |
| Forma de las plataformas de respuesta | `src/components/platforms/AnswerPlatforms.tsx` |
| Aspecto / lógica de checkpoints | `src/components/Checkpoint.tsx` |
| Obstáculos (barrera, martillo, ventilador…) | `src/components/obstacles/Obstacles.tsx` |
| Árboles, agua, cielo, nubes | `src/components/environment/LevelEnvironment.tsx` |
| Velocidad, salto, A/D, no volver atrás | `src/player/Player.tsx` |
| Apariencia del personaje (camisa, lentes, mochila) | `src/player/PlayerVisual.tsx` |
| Cámara en partida | `src/game/ThirdPersonCamera.tsx` |
| Cámara del menú 3D | `src/scenes/HubCamera.tsx` |
| Islas del hub | `src/scenes/HubWorld.tsx` |
| HUD, intro, pausa, resultados, settings | `src/ui/Overlay.tsx` |
| Tamaño de la frase, botones, colores UI | `src/index.css` |
| Vidas, streak, XP, desbloqueo, fases | `src/store/gameStore.ts` |
| Estrellas y XP al terminar | `src/game/scoring.ts` |
| Volumen, música, SFX | `src/audio/sfx.ts` y `src/audio/audioManager.ts` |
| Clips de listening (mp3) | `src/audio/listening.ts` + carpeta `public/audio/listening/` |
| Guardado local | `src/data/storage.ts` |
| Puerto de Vite | `vite.config.ts` |

---

## 1. Niveles (lo más habitual)

Cada nivel es un archivo:

- `src/data/levels/level01.ts` → Level 1 First Steps
- `src/data/levels/level02.ts` → Level 2
- … hasta `level10.ts`

Se arma con `TrackBuilder` en cadena. Ejemplo real del Level 1:

```ts
b.pad(22, 26, { color: '#46d07f' })
  .barrier()
  .challenge({
    type: 'grammar',
    sentence: 'She ___ a teacher.',
    options: ['IS', 'ARE', 'AM'],
    correctAnswer: 'IS',
    lanes: [-6.2, 0, 6.2],
  })
  .checkpoint()
  .finish(16, 20)
```

Al final, metadatos en `b.build({...})`: `name`, `subtitle`, `theme`, `hubLabel`, `parTime`, `palette`.

Si cambias nombre / tema del hub, actualiza también el array `levelCatalog` en `src/data/levels.ts`.

Para registrar un nivel nuevo: créalo en `src/data/levels/`, agrégalo a `levelCatalog` y a `factories` en `src/data/levels.ts`.

### API de TrackBuilder (`src/data/trackBuilder.ts`)

| Método | Qué hace |
| --- | --- |
| `pad(ancho, largo, { color, kind, motion })` | Plataforma y avanza Z |
| `gap(largo)` | Hueco (hay que saltar) |
| `shift(dx, dy?)` | Mueve el cursor en X / Y |
| `setX(x)` / `setY(y)` | Fija el cursor |
| `barrier()` | Muro rojo a todo el ancho del último pad |
| `hammer(offsetX, speed)` | Martillo |
| `fan(offsetX, speed)` | Ventilador |
| `spinner(offsetX, speed)` | Spinner |
| `movingBlock(offsetX)` | Bloque que se mueve |
| `challenge({ type, sentence, options, correctAnswer, lanes })` | 3 plataformas de respuesta |
| `checkpoint()` | Checkpoint (ya entra hacia adentro del pad, no en el borde) |
| `coinRow(cantidad, espacio)` | Fila de monedas |
| `zone('texto')` | Letrero 3D en el mundo |
| `finish(ancho, largo)` | Arco de meta + pad final |

Tipos de `challenge`: `'grammar' | 'vocabulary' | 'listening' | 'context'`.

Listening: pon `type: 'listening'`, `audioText` (fallback TTS), `audioKey` (archivo mp3) y `hideSentence: true` si no debe verse la frase.

Plataformas especiales en `pad(..., { kind })`: `'static' | 'moving' | 'vanishing' | 'rotating' | 'bounce' | 'recovery'`.

---

## 2. Colores del mundo

`src/data/worlds.ts` → objeto `palettes`:

- `skyTop` / `skyBottom` — cielo
- `fog` — niebla
- `ground` — suelo / islas
- `accent` — color de isla en el hub
- `water` — agua

Cada nivel elige una paleta en `b.build({ palette: palettes.training })`.

El entorno 3D (árboles, agua, nubes) se dibuja en `src/components/environment/LevelEnvironment.tsx`.

---

## 3. Jugador y cámara

| Qué | Dónde |
| --- | --- |
| Velocidad, sprint, salto | Constantes arriba de `src/player/Player.tsx` (`MOVE_SPEED`, `SPRINT_SPEED`, `JUMP_VEL`) |
| Invertir A / D | Mismas líneas `KeyA` / `KeyD` en `Player.tsx` |
| Bloqueo de no volver atrás | `Player.tsx` (clamp `minZ`) + `ProgressLock` en `src/game/LevelWorld.tsx` |
| Teclas capturadas | `src/player/useKeyboard.ts` |
| Skin / cosmética 3D | `src/player/PlayerVisual.tsx` |
| Cámara tercera persona | `src/game/ThirdPersonCamera.tsx` |
| Física de la sesión (gravedad, pausa) | `src/scenes/GameSession.tsx` |

Esc / A-D en el hub / Enter para jugar: `src/ui/Overlay.tsx` (el `useEffect` de teclado al inicio).

---

## 4. UI (menús, HUD, frase)

Todo el HTML de la interfaz está en `src/ui/Overlay.tsx`:

| Bloque | Función |
| --- | --- |
| Hub (título, Play, Style, Audio) | `HubChrome` |
| Vidas, streak, tiempo, frase | `HUD` |
| Frase grande de la pregunta | `className="prompt"` en `HUD` |
| Carta de intro | `IntroCard` |
| 3, 2, 1 | `Countdown` |
| Pausa | `PauseCard` |
| Resultados / estrellas | `ResultsCard` |
| Game over | `FailCard` |
| Créditos Level 10 | `CreditsCard` |
| Camisa / lentes / mochila | `CustomizePanel` |
| Volumen | `SettingsPanel` |

Estilos: `src/index.css`. La frase usa `.prompt` (tamaño, sombra, ancho).

Textos 3D (CHECKPOINT, WORD BRIDGE 3D, números de isla): `src/components/WorldLabel.tsx`.

---

## 5. Gameplay (vidas, respuestas, progreso)

`src/store/gameStore.ts`:

- `lives` (empiezan en 3 en `startLevel`)
- `answer()` — respuesta correcta / incorrecta
- `loseLife()` — caída o error
- `setCheckpoint` / `setMinZ` / `uncomplete` — no volver atrás
- `finishLevel` / `failLevel`
- desbloqueo del siguiente nivel y XP

Estrellas y fórmula de XP: `src/game/scoring.ts` (`parTime` de cada nivel influye en el bonus de tiempo).

Montaje del mundo 3D (plataformas + retos + FX): `src/game/LevelWorld.tsx`.

- `ChallengeDirector` — cuándo mostrar la frase / reproducir listening
- `ProgressLock` — si retrocedes antes de avanzar, se descompleta el reto

---

## 6. Audio

| Qué | Dónde |
| --- | --- |
| Beeps (salto, moneda, error, meta) | `src/audio/sfx.ts` |
| API unificada + volúmenes | `src/audio/audioManager.ts` |
| TTS si no hay mp3 | `src/audio/speech.ts` |
| Mapa de mp3 de listening | `src/audio/listening.ts` |

Para un clip real: pon el archivo en `public/audio/listening/{key}.mp3` y usa ese `audioKey` en el `challenge()` del nivel.

---

## 7. Guardado

`src/data/storage.ts` — `localStorage`, clave `word-bridge-3d-save-v1`.

Ahí están cosmética por defecto, volumen por defecto y `unlockedLevel`.

Firebase (pendiente): `src/data/firebase.ts` + `setSaveAdapter`.

---

## 8. Arranque 3D (casi nunca)

| Archivo | Rol |
| --- | --- |
| `src/main.tsx` | Entry de React |
| `src/App.tsx` | Canvas WebGL + hub vs partida |
| `src/components/CanvasErrorBoundary.tsx` | Botón “Reload 3D” si se pierde el contexto |
| `src/index.css` | Layout a pantalla completa, overlay, HUD |

---

## Flujo típico

1. Cambiar una pregunta → `src/data/levels/level0X.ts`
2. Que el hub muestre otro título → `src/data/levels.ts` + `b.build` de ese nivel
3. Pista más ancha / más obstáculos → mismo archivo de nivel (`pad`, `barrier`, `gap`)
4. El muro rojo no cubre todo → `barrier()` en `src/data/trackBuilder.ts`
5. La frase se ve chica → `.prompt` en `src/index.css`
6. El personaje va lento / salta poco → constantes en `src/player/Player.tsx`
7. Estrellas demasiado fáciles → umbrales en `src/game/scoring.ts`
