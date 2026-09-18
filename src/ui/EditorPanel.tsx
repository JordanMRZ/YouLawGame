import { useEffect, useMemo, useState } from 'react'
import { listDraftIds } from '../data/editorDrafts'
import { LEVEL_COUNT, levelCatalog } from '../data/levels'
import { worldMeta } from '../data/worlds'
import type { ChallengeDef, LevelDef, ObstacleDef, PlatformDef, Vec3 } from '../data/types'
import {
  CHALLENGE_TYPES,
  OBSTACLE_KINDS,
  PLATFORM_KINDS,
  patchMotion,
  selectionKey,
  useEditorStore,
  type AddKit,
  type EditorSelection,
} from '../store/editorStore'

type OutlinerTab = 'all' | 'questions' | 'platforms' | 'obstacles' | 'pickups'

const ADD_GROUPS: { title: string; items: { id: AddKit; label: string }[] }[] = [
  {
    title: 'Plataformas',
    items: [
      { id: 'static', label: 'Suelo' },
      { id: 'moving', label: 'Móvil' },
      { id: 'vanishing', label: 'Fugaz' },
      { id: 'bounce', label: 'Rebote' },
      { id: 'rotating', label: 'Gira' },
    ],
  },
  {
    title: 'Pregunta',
    items: [{ id: 'question', label: '+ Pregunta' }],
  },
  {
    title: 'Obstáculos',
    items: [
      { id: 'barrier', label: 'Muro' },
      { id: 'hammer', label: 'Martillo' },
      { id: 'fan', label: 'Ventilador' },
      { id: 'spinner', label: 'Aspa' },
      { id: 'movingBlock', label: 'Bloque' },
    ],
  },
  {
    title: 'Pickups',
    items: [
      { id: 'coin', label: 'Moneda' },
      { id: 'checkpoint', label: 'Checkpoint' },
      { id: 'goal', label: 'Meta' },
    ],
  },
]

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

function pick(sel: EditorSelection, focus = true) {
  const store = useEditorStore.getState()
  store.select(sel)
  if (focus) store.focusSelected()
}

export function EditorPanel() {
  const draft = useEditorStore((s) => s.draft)
  const selected = useEditorStore((s) => s.selected)
  const tool = useEditorStore((s) => s.tool)
  const previewMotion = useEditorStore((s) => s.previewMotion)
  const message = useEditorStore((s) => s.message)
  const dirty = useEditorStore((s) => s.dirty)
  const levelId = useEditorStore((s) => s.levelId)
  const [tab, setTab] = useState<OutlinerTab>('questions')
  const [query, setQuery] = useState('')
  const drafts = useMemo(() => new Set(listDraftIds()), [dirty, levelId, draft])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        if (event.code === 'Escape') (event.target as HTMLElement).blur()
        return
      }
      const store = useEditorStore.getState()
      if (event.code === 'BracketLeft') {
        event.preventDefault()
        store.switchLevel(Math.max(1, store.levelId - 1))
      }
      if (event.code === 'BracketRight') {
        event.preventDefault()
        store.switchLevel(Math.min(LEVEL_COUNT, store.levelId + 1))
      }
      if (event.code === 'KeyG') {
        event.preventDefault()
        store.setTool('translate')
      }
      if (event.code === 'KeyS' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        store.setTool('scale')
      }
      if (event.code === 'KeyF') {
        event.preventDefault()
        store.focusSelected()
      }
      if (event.code === 'Escape') {
        event.preventDefault()
        store.select(null)
      }
      if (event.code === 'Delete' || event.code === 'Backspace') {
        event.preventDefault()
        store.deleteSelected()
      }
      if ((event.ctrlKey || event.metaKey) && event.code === 'KeyZ') {
        event.preventDefault()
        store.undo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!draft) return null
  const worlds = [...new Set(levelCatalog.map((item) => item.world))]
  const questionIndex = draft.challenges.findIndex((item) => item.id === selected?.id)

  return (
    <div className="editor-ui">
      <header className="editor-toolbar">
        <button type="button" onClick={() => useEditorStore.getState().leaveEditor()}>
          Hub
        </button>
        <div className="editor-level-switch">
          <button
            type="button"
            disabled={levelId <= 1}
            onClick={() => useEditorStore.getState().switchLevel(levelId - 1)}
          >
            ◀
          </button>
          <label className="editor-level-pick">
            Nivel a editar
            <select
              value={levelId}
              onChange={(event) => useEditorStore.getState().switchLevel(Number(event.target.value))}
            >
              {worlds.map((world) => (
                <optgroup key={world} label={worldMeta[world]?.title ?? world}>
                  {levelCatalog
                    .filter((item) => item.world === world)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {String(item.id).padStart(2, '0')} · {item.name}
                        {drafts.has(item.id) ? ' •' : ''}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={levelId >= LEVEL_COUNT}
            onClick={() => useEditorStore.getState().switchLevel(levelId + 1)}
          >
            ▶
          </button>
        </div>
        <ObjectJump selected={selected} />
        {dirty && <span className="editor-draft-tag">sin guardar en código</span>}
        <div className="editor-tools">
          <button type="button" className={tool === 'translate' ? 'on' : ''} onClick={() => useEditorStore.getState().setTool('translate')}>
            Mover
          </button>
          <button type="button" className={tool === 'scale' ? 'on' : ''} onClick={() => useEditorStore.getState().setTool('scale')}>
            Escalar
          </button>
          <button type="button" className={previewMotion ? 'on' : ''} onClick={() => useEditorStore.getState().setPreviewMotion(!previewMotion)}>
            Animar
          </button>
        </div>
        <div className="editor-tools editor-toolbar-end">
          <button type="button" className="primary" onClick={() => useEditorStore.getState().playtest()}>
            Probar
          </button>
          <button type="button" onClick={() => void useEditorStore.getState().exportJson()}>
            JSON
          </button>
          <button type="button" onClick={() => void useEditorStore.getState().exportTs()}>
            TypeScript
          </button>
          <button type="button" onClick={() => useEditorStore.getState().resetToCode()}>
            Restablecer
          </button>
        </div>
        {message && <p className="editor-msg">{message}</p>}
      </header>

      <aside className="editor-left">
        <p className="kicker">1. Colocar</p>
        {ADD_GROUPS.map((group) => (
          <div key={group.title} className="editor-add-group">
            <span>{group.title}</span>
            <div>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === 'question' ? 'primary' : ''}
                  onClick={() => {
                    useEditorStore.getState().addKit(item.id)
                    if (item.id === 'question') setTab('questions')
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="kicker editor-outliner-title">2. Elegir objeto</p>
        <div className="editor-tabs">
          {(
            [
              ['questions', `Preguntas (${draft.challenges.length})`],
              ['platforms', 'Suelos'],
              ['obstacles', 'Obstáculos'],
              ['pickups', 'Pickups'],
              ['all', 'Todo'],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
        <input
          className="editor-search"
          placeholder="Buscar pregunta o pieza…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="editor-outliner">
          <Outliner tab={tab} query={query} selected={selected} />
        </div>
      </aside>

      <aside className="editor-right">
        <p className="kicker">3. Editar aquí</p>
        {questionIndex >= 0 && (
          <p className="editor-inspect-tag">
            Pregunta {questionIndex + 1} de {draft.challenges.length}
          </p>
        )}
        <Inspector onShowQuestions={() => setTab('questions')} />
      </aside>

      <p className="editor-status">
        {selected?.kind === 'challenge' || selected?.kind === 'option'
          ? 'La frase y las 3 respuestas se editan a la derecha. Clic en una plataforma con palabra también las abre.'
          : 'Elige una pregunta en “Preguntas” o en el selector de objeto. [ y ] cambian de nivel.'}
      </p>
    </div>
  )
}

function ObjectJump({ selected }: { selected: EditorSelection | null }) {
  const draft = useEditorStore((s) => s.draft)
  const items = useMemo(() => (draft ? objectItems(draft) : []), [draft])
  const value = selectionKey(selected)
  return (
    <label className="editor-object-pick">
      Ir al objeto
      <select
        value={items.some((item) => item.key === value) ? value : ''}
        onChange={(event) => {
          const next = items.find((item) => item.key === event.target.value)
          if (next) pick(next.sel)
        }}
      >
        <option value="">Elegir…</option>
        {items.map((item) => (
          <option key={item.key} value={item.key}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function objectItems(draft: LevelDef) {
  const items: { key: string; label: string; sel: EditorSelection }[] = [
    { key: selectionKey({ kind: 'start', id: 'start' }), label: 'Inicio', sel: { kind: 'start', id: 'start' } },
    { key: selectionKey({ kind: 'goal', id: 'goal' }), label: 'Meta', sel: { kind: 'goal', id: 'goal' } },
  ]
  draft.challenges.forEach((challenge, index) => {
    items.push({
      key: selectionKey({ kind: 'challenge', id: challenge.id }),
      label: `P${index + 1} · ${challenge.sentence ?? 'Pregunta'}`,
      sel: { kind: 'challenge', id: challenge.id },
    })
    challenge.options.forEach((option, optionIndex) => {
      items.push({
        key: selectionKey({ kind: 'option', id: challenge.id, optionIndex }),
        label: `   ${option.word}`,
        sel: { kind: 'option', id: challenge.id, optionIndex },
      })
    })
  })
  draft.platforms.forEach((platform, index) => {
    items.push({
      key: selectionKey({ kind: 'platform', id: platform.id }),
      label: `${kindName(platform.kind ?? 'static')} ${index + 1}`,
      sel: { kind: 'platform', id: platform.id },
    })
  })
  draft.obstacles.forEach((obstacle, index) => {
    items.push({
      key: selectionKey({ kind: 'obstacle', id: obstacle.id }),
      label: `${obstacleName(obstacle.kind)} ${index + 1}`,
      sel: { kind: 'obstacle', id: obstacle.id },
    })
  })
  draft.coins.forEach((coin, index) => {
    items.push({
      key: selectionKey({ kind: 'coin', id: coin.id }),
      label: `Moneda ${index + 1}`,
      sel: { kind: 'coin', id: coin.id },
    })
  })
  draft.checkpoints.forEach((checkpoint, index) => {
    items.push({
      key: selectionKey({ kind: 'checkpoint', id: checkpoint.id }),
      label: `Checkpoint ${index + 1}`,
      sel: { kind: 'checkpoint', id: checkpoint.id },
    })
  })
  return items
}

function Outliner({
  tab,
  query,
  selected,
}: {
  tab: OutlinerTab
  query: string
  selected: EditorSelection | null
}) {
  const draft = useEditorStore((s) => s.draft)
  if (!draft) return null
  const q = query.trim().toLowerCase()
  const match = (text: string) => !q || text.toLowerCase().includes(q)
  const showQ = tab === 'all' || tab === 'questions'
  const showP = tab === 'all' || tab === 'platforms'
  const showO = tab === 'all' || tab === 'obstacles'
  const showK = tab === 'all' || tab === 'pickups'

  return (
    <>
      {showK && match('inicio start') && (
        <ListButton sel={{ kind: 'start', id: 'start' }} selected={selected} label="Inicio (personaje)" />
      )}
      {showK && match('meta goal') && (
        <ListButton sel={{ kind: 'goal', id: 'goal' }} selected={selected} label="Meta" />
      )}
      {showQ && (
        <>
          {draft.challenges.length === 0 && <p className="muted">No hay preguntas. Pulsa + Pregunta.</p>}
          {draft.challenges.map((challenge, index) => {
            const label = `P${index + 1} · ${challenge.sentence ?? challenge.id}`
            if (!match(label) && !challenge.options.some((option) => match(option.word))) return null
            return (
              <div key={challenge.id} className="editor-q-block">
                <ListButton sel={{ kind: 'challenge', id: challenge.id }} selected={selected} label={label} />
                {challenge.options.map((option, optionIndex) => (
                  <ListButton
                    key={`${challenge.id}-${optionIndex}`}
                    sel={{ kind: 'option', id: challenge.id, optionIndex }}
                    selected={selected}
                    label={`${option.word === challenge.correctAnswer ? '✓' : '○'} ${option.word}`}
                    nested
                  />
                ))}
              </div>
            )
          })}
        </>
      )}
      {showP &&
        draft.platforms.map((platform, index) => {
          const kind = platform.kind ?? 'static'
          const label = `${kindName(kind)} ${index + 1}`
          if (!match(label)) return null
          return <ListButton key={platform.id} sel={{ kind: 'platform', id: platform.id }} selected={selected} label={label} />
        })}
      {showO &&
        draft.obstacles.map((obstacle, index) => {
          const label = `${obstacleName(obstacle.kind)} ${index + 1}`
          if (!match(label)) return null
          return <ListButton key={obstacle.id} sel={{ kind: 'obstacle', id: obstacle.id }} selected={selected} label={label} />
        })}
      {showK &&
        draft.coins.map((coin, index) => {
          const label = `Moneda ${index + 1}`
          if (!match(label)) return null
          return <ListButton key={coin.id} sel={{ kind: 'coin', id: coin.id }} selected={selected} label={label} />
        })}
      {showK &&
        draft.checkpoints.map((checkpoint, index) => {
          const label = `Checkpoint ${index + 1}`
          if (!match(label)) return null
          return (
            <ListButton
              key={checkpoint.id}
              sel={{ kind: 'checkpoint', id: checkpoint.id }}
              selected={selected}
              label={label}
            />
          )
        })}
    </>
  )
}

function ListButton({
  sel,
  selected,
  label,
  nested,
}: {
  sel: EditorSelection
  selected: EditorSelection | null
  label: string
  nested?: boolean
}) {
  const on =
    selected?.kind === sel.kind && selected.id === sel.id && (selected.optionIndex ?? -1) === (sel.optionIndex ?? -1)
  return (
    <button
      type="button"
      className={`${on ? 'on' : ''} ${nested ? 'nested' : ''}`}
      onClick={() => pick(sel)}
      onDoubleClick={() => useEditorStore.getState().focusSelected()}
    >
      {label}
    </button>
  )
}

function Inspector({ onShowQuestions }: { onShowQuestions: () => void }) {
  const draft = useEditorStore((s) => s.draft)
  const selected = useEditorStore((s) => s.selected)
  if (!draft) return null

  if (!selected) {
    return (
      <div className="editor-empty">
        <h3>Nada seleccionado</h3>
        <p>
          Las <strong>preguntas</strong> son las 3 plataformas con palabras (IS / ARE / AM). El texto se edita aquí, a la
          derecha.
        </p>
        <button type="button" className="primary" onClick={onShowQuestions}>
          Ver lista de preguntas
        </button>
      </div>
    )
  }

  if (selected.kind === 'challenge' || selected.kind === 'option') {
    const challenge = draft.challenges.find((item) => item.id === selected.id)
    if (!challenge) return null
    return (
      <ChallengeInspector
        challenge={challenge}
        highlightIndex={selected.kind === 'option' ? selected.optionIndex : undefined}
      />
    )
  }
  if (selected.kind === 'platform') {
    const platform = draft.platforms.find((item) => item.id === selected.id)
    if (!platform) return null
    return <PlatformInspector platform={platform} />
  }
  if (selected.kind === 'obstacle') {
    const obstacle = draft.obstacles.find((item) => item.id === selected.id)
    if (!obstacle) return null
    return <ObstacleInspector obstacle={obstacle} />
  }
  if (selected.kind === 'coin') {
    const coin = draft.coins.find((item) => item.id === selected.id)
    if (!coin) return null
    return (
      <>
        <h3>Moneda</h3>
        <VecField label="Posición" value={coin.position} onChange={(position) => patch({ position })} />
      </>
    )
  }
  if (selected.kind === 'checkpoint') {
    const checkpoint = draft.checkpoints.find((item) => item.id === selected.id)
    if (!checkpoint) return null
    return (
      <>
        <h3>Checkpoint</h3>
        <VecField label="Posición" value={checkpoint.position} onChange={(position) => patch({ position })} />
        <NumField label="Ancho" value={checkpoint.width ?? 8} onChange={(width) => patch({ width })} />
      </>
    )
  }
  if (selected.kind === 'goal') {
    return (
      <>
        <h3>Meta</h3>
        <VecField label="Posición" value={draft.goal.position} onChange={(position) => patch({ position })} />
        <VecField label="Tamaño" value={draft.goal.size ?? [4, 3, 2]} onChange={(size) => patch({ size })} />
      </>
    )
  }
  return (
    <>
      <h3>Inicio</h3>
      <VecField label="Posición" value={draft.start} onChange={(position) => patch({ position })} />
    </>
  )
}

function PlatformInspector({ platform }: { platform: PlatformDef }) {
  const kind = platform.kind ?? 'static'
  return (
    <>
      <h3>Suelo</h3>
      <label>
        Tipo
        <select
          value={kind}
          onChange={(event) => {
            const next = event.target.value as PlatformDef['kind']
            const extra: Record<string, unknown> = { kind: next }
            if (next === 'moving' && !platform.motion) extra.motion = { axis: 'x', amplitude: 3, speed: 1.2, phase: 0 }
            if (next === 'rotating' && platform.rotationSpeed == null) extra.rotationSpeed = 0.6
            patch(extra)
          }}
        >
          {PLATFORM_KINDS.map((item) => (
            <option key={item} value={item}>
              {kindName(item)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Color
        <input type="color" value={toColor(platform.color)} onChange={(event) => patch({ color: event.target.value })} />
      </label>
      <VecField label="Posición" value={platform.position} onChange={(position) => patch({ position })} />
      <VecField label="Tamaño" value={platform.size} onChange={(size) => patch({ size })} />
      {(kind === 'moving' || platform.motion) && (
        <MotionFields motion={platform.motion} onChange={(motion) => patch({ motion })} />
      )}
      {kind === 'rotating' && (
        <NumField
          label="Velocidad de giro"
          value={platform.rotationSpeed ?? 0.8}
          onChange={(rotationSpeed) => patch({ rotationSpeed })}
        />
      )}
    </>
  )
}

function ChallengeInspector({
  challenge,
  highlightIndex,
}: {
  challenge: ChallengeDef
  highlightIndex?: number
}) {
  return (
    <>
      <p className="kicker">Texto de la pregunta</p>
      <h3>Frase y respuestas</h3>
      <p className="muted">Esto es lo que ve el jugador. Cambia la frase y las 3 palabras de las plataformas.</p>
      <label>
        Frase (usa ___ para el hueco)
        <textarea value={challenge.sentence ?? ''} onChange={(event) => patch({ sentence: event.target.value })} />
      </label>
      <label>
        Tipo
        <select value={challenge.type} onChange={(event) => patch({ type: event.target.value })}>
          {CHALLENGE_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <div className="editor-answers">
        {challenge.options.map((option, index) => {
          const correct = option.word === challenge.correctAnswer
          return (
            <div
              key={index}
              className={`editor-answer ${correct ? 'correct' : ''} ${highlightIndex === index ? 'on' : ''}`}
            >
              <button type="button" className="editor-correct-btn" onClick={() => patch({ correctAnswer: option.word })}>
                {correct ? 'Correcta' : 'Marcar correcta'}
              </button>
              <input
                value={option.word}
                onChange={(event) => {
                  const word = event.target.value
                  const options = challenge.options.map((item, i) => (i === index ? { ...item, word } : item))
                  patch({
                    options,
                    correctAnswer: challenge.correctAnswer === option.word ? word : challenge.correctAnswer,
                  })
                }}
                onFocus={() =>
                  useEditorStore.getState().select({ kind: 'option', id: challenge.id, optionIndex: index })
                }
              />
            </div>
          )
        })}
      </div>
      <NumField label="Segundos" value={challenge.timeLimit ?? 15} onChange={(timeLimit) => patch({ timeLimit })} />
      <label className="editor-check">
        <input
          type="checkbox"
          checked={Boolean(challenge.hideSentence)}
          onChange={(event) => patch({ hideSentence: event.target.checked })}
        />
        Ocultar frase en juego (listening)
      </label>
      <label>
        Audio (opcional)
        <input value={challenge.audioText ?? ''} onChange={(event) => patch({ audioText: event.target.value || undefined })} />
      </label>
      <label>
        Explicación si falla
        <textarea
          value={challenge.explanation ?? ''}
          onChange={(event) => patch({ explanation: event.target.value || undefined })}
        />
      </label>
      <details className="editor-advanced">
        <summary>Posición en la pista</summary>
        <VecField label="Origen" value={challenge.origin} onChange={(origin) => patch({ origin })} />
        <VecField
          label="Tamaño de cada pad"
          value={challenge.platformSize ?? [4.5, 0.72, 4.6]}
          onChange={(platformSize) => patch({ platformSize })}
        />
      </details>
    </>
  )
}

function ObstacleInspector({ obstacle }: { obstacle: ObstacleDef }) {
  return (
    <>
      <h3>Obstáculo</h3>
      <label>
        Tipo
        <select value={obstacle.kind} onChange={(event) => patch({ kind: event.target.value })}>
          {OBSTACLE_KINDS.map((item) => (
            <option key={item} value={item}>
              {obstacleName(item)}
            </option>
          ))}
        </select>
      </label>
      <VecField label="Posición" value={obstacle.position} onChange={(position) => patch({ position })} />
      <VecField label="Tamaño" value={obstacle.size ?? [1.6, 1.6, 1.6]} onChange={(size) => patch({ size })} />
      <NumField label="Velocidad" value={obstacle.speed ?? 1} onChange={(speed) => patch({ speed })} />
      <MotionFields motion={obstacle.motion} onChange={(motion) => patch({ motion })} />
    </>
  )
}

function MotionFields({
  motion,
  onChange,
}: {
  motion: PlatformDef['motion'] | ObstacleDef['motion'] | undefined
  onChange: (motion: NonNullable<PlatformDef['motion']>) => void
}) {
  const value = motion ?? { axis: 'x' as const, amplitude: 3, speed: 1.2, phase: 0 }
  return (
    <div className="editor-motion">
      <p className="kicker">Movimiento</p>
      <label>
        Eje
        <select
          value={value.axis}
          onChange={(event) => onChange(patchMotion(value, 'axis', event.target.value) as NonNullable<PlatformDef['motion']>)}
        >
          <option value="x">x</option>
          <option value="y">y</option>
          <option value="z">z</option>
        </select>
      </label>
      <NumField
        label="Amplitud"
        value={value.amplitude}
        onChange={(amplitude) => onChange(patchMotion(value, 'amplitude', amplitude) as NonNullable<PlatformDef['motion']>)}
      />
      <NumField
        label="Velocidad"
        value={value.speed ?? 1}
        onChange={(speed) => onChange(patchMotion(value, 'speed', speed) as NonNullable<PlatformDef['motion']>)}
      />
      <NumField
        label="Fase"
        value={value.phase ?? 0}
        onChange={(phase) => onChange(patchMotion(value, 'phase', phase) as NonNullable<PlatformDef['motion']>)}
      />
    </div>
  )
}

function VecField({ label, value, onChange }: { label: string; value: Vec3; onChange: (value: Vec3) => void }) {
  return (
    <div className="editor-vec">
      <span>{label}</span>
      {value.map((n, index) => (
        <input
          key={index}
          type="number"
          step={0.5}
          value={Number.isFinite(n) ? n : 0}
          onChange={(event) => {
            const next: Vec3 = [...value]
            next[index] = Number(event.target.value)
            if (!Number.isFinite(next[index])) return
            onChange(next)
          }}
        />
      ))}
    </div>
  )
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label>
      {label}
      <input
        type="number"
        step={0.1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (!Number.isFinite(next)) return
          onChange(next)
        }}
      />
    </label>
  )
}

function patch(next: Record<string, unknown>) {
  useEditorStore.getState().patchSelected(next)
}

function toColor(value: string | undefined) {
  return value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#6fa8dc'
}

function kindName(kind: string) {
  if (kind === 'moving') return 'Móvil'
  if (kind === 'vanishing') return 'Fugaz'
  if (kind === 'bounce') return 'Rebote'
  if (kind === 'rotating') return 'Gira'
  if (kind === 'recovery') return 'Red'
  return 'Suelo'
}

function obstacleName(kind: string) {
  if (kind === 'barrier') return 'Muro'
  if (kind === 'hammer') return 'Martillo'
  if (kind === 'fan') return 'Ventilador'
  if (kind === 'spinner') return 'Aspa'
  if (kind === 'movingBlock') return 'Bloque'
  return kind
}
