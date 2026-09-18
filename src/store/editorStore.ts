import { create } from 'zustand'
import { clearDraft, peekDraft, saveDraft } from '../data/editorDrafts'
import { getFactoryLevel, unloadLevel } from '../data/levels'
import type {
  ChallengeDef,
  ChallengeType,
  LevelDef,
  ObstacleDef,
  ObstacleKind,
  PlatformDef,
  PlatformKind,
  Vec3,
} from '../data/types'
import { useGameStore } from './gameStore'

export type EditorKind = 'platform' | 'challenge' | 'option' | 'obstacle' | 'coin' | 'checkpoint' | 'goal' | 'start'

export type EditorTool = 'translate' | 'scale'

export type AddKit =
  | 'static'
  | 'moving'
  | 'vanishing'
  | 'bounce'
  | 'rotating'
  | 'question'
  | 'barrier'
  | 'hammer'
  | 'fan'
  | 'spinner'
  | 'movingBlock'
  | 'coin'
  | 'checkpoint'
  | 'goal'

export interface EditorSelection {
  kind: EditorKind
  id: string
  optionIndex?: number
}

export const editorCursor: { current: Vec3 } = { current: [0, 2, 8] }

let seq = 1
function uid(prefix: string) {
  seq += 1
  return `${prefix}${Date.now().toString(36)}${seq.toString(36)}`
}

function cloneLevel(level: LevelDef): LevelDef {
  return structuredClone(level)
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

export function snapVec(v: Vec3, snap: number): Vec3 {
  if (snap <= 0) return [round2(v[0]), round2(v[1]), round2(v[2])]
  return [
    Math.round(v[0] / snap) * snap,
    Math.round(v[1] / snap) * snap,
    Math.round(v[2] / snap) * snap,
  ]
}

function spawnAt(): Vec3 {
  const [x, y, z] = editorCursor.current
  return snapVec([x, Math.max(0.4, y), z], 0.5)
}

export function selectionKey(sel: EditorSelection | null) {
  if (!sel) return ''
  return `${sel.kind}:${sel.id}:${sel.optionIndex ?? ''}`
}

export function getSelectedPose(draft: LevelDef, sel: EditorSelection): { position: Vec3; size: Vec3 } | null {
  switch (sel.kind) {
    case 'platform': {
      const p = draft.platforms.find((item) => item.id === sel.id)
      return p ? { position: p.position, size: p.size } : null
    }
    case 'challenge': {
      const c = draft.challenges.find((item) => item.id === sel.id)
      return c ? { position: c.origin, size: c.platformSize ?? [4.5, 0.72, 4.6] } : null
    }
    case 'option': {
      const c = draft.challenges.find((item) => item.id === sel.id)
      const opt = c?.options[sel.optionIndex ?? 0]
      if (!c || !opt) return null
      return {
        position: [c.origin[0] + opt.offset[0], c.origin[1] + opt.offset[1], c.origin[2] + opt.offset[2]],
        size: c.platformSize ?? [4.5, 0.72, 4.6],
      }
    }
    case 'obstacle': {
      const o = draft.obstacles.find((item) => item.id === sel.id)
      return o ? { position: o.position, size: o.size ?? defaultObstacleSize(o.kind) } : null
    }
    case 'coin': {
      const n = draft.coins.find((item) => item.id === sel.id)
      return n ? { position: n.position, size: [0.6, 0.6, 0.6] } : null
    }
    case 'checkpoint': {
      const k = draft.checkpoints.find((item) => item.id === sel.id)
      return k ? { position: k.position, size: [k.width ?? 8, 0.4, 1.2] } : null
    }
    case 'goal':
      return { position: draft.goal.position, size: draft.goal.size ?? [4, 3, 2] }
    case 'start':
      return { position: draft.start, size: [1.2, 1.8, 1.2] }
    default:
      return null
  }
}

export function defaultObstacleSize(kind: ObstacleKind): Vec3 {
  if (kind === 'barrier') return [4, 2, 0.85]
  if (kind === 'fan') return [2.4, 2.2, 2.4]
  if (kind === 'movingBlock') return [1.6, 1.6, 1.6]
  if (kind === 'hammer') return [1.2, 3.2, 1.2]
  return [1.6, 1.6, 1.6]
}

export function canScale(kind: EditorKind) {
  return kind === 'platform' || kind === 'obstacle' || kind === 'challenge' || kind === 'goal' || kind === 'checkpoint'
}

function formatNum(n: number) {
  if (Number.isInteger(n)) return String(n)
  const text = n.toFixed(2).replace(/\.?0+$/, '')
  return text
}

function quoteKey(key: string) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(key) ? key : JSON.stringify(key)
}

export function toTsLiteral(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  const inner = '  '.repeat(indent + 1)
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number') return Number.isFinite(value) ? formatNum(value) : '0'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    if (value.length <= 4 && value.every((item) => typeof item === 'number')) {
      return `[${value.map((n) => formatNum(n as number)).join(', ')}]`
    }
    return `[\n${value.map((item) => `${inner}${toTsLiteral(item, indent + 1)}`).join(',\n')}\n${pad}]`
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, item]) => item !== undefined)
    if (entries.length === 0) return '{}'
    return `{\n${entries.map(([key, item]) => `${inner}${quoteKey(key)}: ${toTsLiteral(item, indent + 1)}`).join(',\n')}\n${pad}}`
  }
  return 'undefined'
}

export function exportLevelTs(level: LevelDef) {
  return `import type { LevelDef } from '../types'\n\nexport function createLevel${level.id}(): LevelDef {\n  return ${toTsLiteral(level, 1)}\n}\n`
}

let messageTimer: number | null = null

interface EditorState {
  levelId: number
  draft: LevelDef | null
  selected: EditorSelection | null
  tool: EditorTool
  snap: number
  previewMotion: boolean
  focusToken: number
  undoStack: string[]
  message: string | null
  dirty: boolean
  openEditor: (levelId: number) => void
  leaveEditor: () => void
  switchLevel: (levelId: number) => void
  select: (sel: EditorSelection | null) => void
  setTool: (tool: EditorTool) => void
  setSnap: (snap: number) => void
  setPreviewMotion: (value: boolean) => void
  focusSelected: () => void
  beginUndo: () => void
  undo: () => void
  applyWorldTransform: (position: Vec3, size: Vec3) => void
  patchSelected: (patch: Record<string, unknown>) => void
  addKit: (kind: AddKit) => void
  deleteSelected: () => void
  resetToCode: () => void
  playtest: () => void
  exportJson: () => Promise<void>
  exportTs: () => Promise<void>
}

function showMessage(set: (partial: Partial<EditorState>) => void, text: string) {
  if (messageTimer) window.clearTimeout(messageTimer)
  set({ message: text })
  messageTimer = window.setTimeout(() => {
    set({ message: null })
  }, 2200)
}

function persist(levelId: number, draft: LevelDef) {
  saveDraft(levelId, draft)
}

export const useEditorStore = create<EditorState>((set, get) => ({
  levelId: 1,
  draft: null,
  selected: null,
  tool: 'translate',
  snap: 0.5,
  previewMotion: true,
  focusToken: 0,
  undoStack: [],
  message: null,
  dirty: false,

  openEditor: (levelId) => {
    const stored = peekDraft(levelId)
    const draft = stored ? cloneLevel(stored) : cloneLevel(getFactoryLevel(levelId))
    editorCursor.current = [...draft.start]
    const firstQuestion = draft.challenges[0]
    set({
      levelId,
      draft,
      selected: firstQuestion ? { kind: 'challenge', id: firstQuestion.id } : null,
      tool: 'translate',
      undoStack: [],
      dirty: stored !== null,
      focusToken: get().focusToken + 1,
      previewMotion: true,
      message: stored ? 'Borrador local' : firstQuestion ? 'Edita la pregunta a la derecha' : null,
    })
    useGameStore.setState({
      phase: 'editor',
      selectedLevel: levelId,
      levelId,
      shopOpen: false,
      settingsOpen: false,
    })
  },

  leaveEditor: () => {
    const { draft, levelId } = get()
    if (draft) persist(levelId, draft)
    useGameStore.setState({ phase: 'hub', editorReturn: false, shopOpen: false })
  },

  switchLevel: (nextId) => {
    if (nextId === get().levelId) return
    const { draft, levelId } = get()
    if (draft) persist(levelId, draft)
    get().openEditor(nextId)
  },

  select: (sel) => set({ selected: sel }),
  setTool: (tool) => set({ tool }),
  setSnap: (snap) => set({ snap }),
  setPreviewMotion: (value) => set({ previewMotion: value }),
  focusSelected: () => set({ focusToken: get().focusToken + 1 }),

  beginUndo: () => {
    const { draft, undoStack } = get()
    if (!draft) return
    const snap = JSON.stringify(draft)
    if (undoStack[undoStack.length - 1] === snap) return
    set({ undoStack: [...undoStack, snap].slice(-30) })
  },

  undo: () => {
    const { undoStack, levelId, selected } = get()
    if (undoStack.length === 0) return
    const prev = undoStack[undoStack.length - 1]
    const draft = JSON.parse(prev) as LevelDef
    persist(levelId, draft)
    set({
      draft,
      undoStack: undoStack.slice(0, -1),
      dirty: true,
      selected,
    })
    showMessage(set, 'Deshecho')
  },

  applyWorldTransform: (position, size) => {
    const { draft, selected, snap, levelId } = get()
    if (!draft || !selected) return
    const next = cloneLevel(draft)
    const pos = snapVec(position, snap)
    const sz: Vec3 = [
      Math.max(0.5, snap === 0 ? round2(size[0]) : Math.max(snap, Math.round(size[0] / snap) * snap)),
      Math.max(0.2, snap === 0 ? round2(size[1]) : Math.max(0.2, Math.round(size[1] / snap) * snap)),
      Math.max(0.5, snap === 0 ? round2(size[2]) : Math.max(snap, Math.round(size[2] / snap) * snap)),
    ]
    switch (selected.kind) {
      case 'platform': {
        const p = next.platforms.find((item) => item.id === selected.id)
        if (!p) return
        p.position = pos
        p.size = sz
        break
      }
      case 'challenge': {
        const c = next.challenges.find((item) => item.id === selected.id)
        if (!c) return
        c.origin = pos
        c.platformSize = sz
        break
      }
      case 'option': {
        const c = next.challenges.find((item) => item.id === selected.id)
        const opt = c?.options[selected.optionIndex ?? 0]
        if (!c || !opt) return
        opt.offset = snapVec([pos[0] - c.origin[0], pos[1] - c.origin[1], pos[2] - c.origin[2]], snap)
        break
      }
      case 'obstacle': {
        const o = next.obstacles.find((item) => item.id === selected.id)
        if (!o) return
        o.position = pos
        o.size = sz
        break
      }
      case 'coin': {
        const n = next.coins.find((item) => item.id === selected.id)
        if (!n) return
        n.position = pos
        break
      }
      case 'checkpoint': {
        const k = next.checkpoints.find((item) => item.id === selected.id)
        if (!k) return
        k.position = pos
        k.width = sz[0]
        break
      }
      case 'goal':
        next.goal.position = pos
        next.goal.size = sz
        break
      case 'start':
        next.start = pos
        break
      default:
        return
    }
    persist(levelId, next)
    set({ draft: next, dirty: true })
  },

  patchSelected: (patch) => {
    const { draft, selected, levelId } = get()
    if (!draft || !selected) return
    get().beginUndo()
    const next = cloneLevel(draft)
    switch (selected.kind) {
      case 'platform': {
        const p = next.platforms.find((item) => item.id === selected.id)
        if (!p) return
        Object.assign(p, patch)
        break
      }
      case 'challenge': {
        const c = next.challenges.find((item) => item.id === selected.id)
        if (!c) return
        Object.assign(c, patch)
        break
      }
      case 'option': {
        const c = next.challenges.find((item) => item.id === selected.id)
        const opt = c?.options[selected.optionIndex ?? 0]
        if (!c || !opt) return
        const challengeKeys = [
          'sentence',
          'type',
          'correctAnswer',
          'options',
          'timeLimit',
          'hideSentence',
          'audioText',
          'explanation',
          'origin',
          'platformSize',
        ]
        if (Object.keys(patch).some((key) => challengeKeys.includes(key))) {
          Object.assign(c, patch)
        } else {
          const prevWord = opt.word
          Object.assign(opt, patch)
          if (typeof patch.word === 'string' && c.correctAnswer === prevWord) {
            c.correctAnswer = patch.word
          }
        }
        break
      }
      case 'obstacle': {
        const o = next.obstacles.find((item) => item.id === selected.id)
        if (!o) return
        Object.assign(o, patch)
        break
      }
      case 'coin': {
        const n = next.coins.find((item) => item.id === selected.id)
        if (!n) return
        Object.assign(n, patch)
        break
      }
      case 'checkpoint': {
        const k = next.checkpoints.find((item) => item.id === selected.id)
        if (!k) return
        Object.assign(k, patch)
        break
      }
      case 'goal':
        next.goal = { ...next.goal, ...patch }
        break
      case 'start':
        if (Array.isArray(patch.position)) next.start = patch.position as Vec3
        break
      default:
        return
    }
    persist(levelId, next)
    set({ draft: next, dirty: true })
  },

  addKit: (kind) => {
    const { draft, levelId } = get()
    if (!draft) return
    get().beginUndo()
    const next = cloneLevel(draft)
    const at = spawnAt()
    let selected: EditorSelection | null = null
    if (kind === 'static' || kind === 'moving' || kind === 'vanishing' || kind === 'bounce' || kind === 'rotating') {
      const platform: PlatformDef = {
        id: uid('p'),
        kind,
        position: at,
        size: [8, 0.8, 8],
        color: colorForPlatform(kind),
      }
      if (kind === 'moving') platform.motion = { axis: 'x', amplitude: 3, speed: 1.2, phase: 0 }
      if (kind === 'rotating') platform.rotationSpeed = 0.6
      next.platforms.push(platform)
      selected = { kind: 'platform', id: platform.id }
    } else if (kind === 'question') {
      const challenge: ChallengeDef = {
        id: uid('q'),
        type: 'grammar',
        origin: at,
        options: [
          { word: 'optionA', offset: [-5.5, 0, 0] },
          { word: 'optionB', offset: [0, 0, 0] },
          { word: 'optionC', offset: [5.5, 0, 0] },
        ],
        correctAnswer: 'optionB',
        platformSize: [4.5, 0.72, 4.6],
        sentence: 'She ___ the lesson yesterday.',
        timeLimit: 15,
      }
      next.challenges.push(challenge)
      selected = { kind: 'challenge', id: challenge.id }
    } else if (kind === 'barrier' || kind === 'hammer' || kind === 'fan' || kind === 'spinner' || kind === 'movingBlock') {
      const obstacle: ObstacleDef = {
        id: uid('o'),
        kind,
        position: [at[0], at[1] + (kind === 'barrier' ? 1 : 1.4), at[2]],
        size: defaultObstacleSize(kind),
        speed: kind === 'barrier' ? undefined : 1.2,
      }
      if (kind === 'movingBlock') {
        obstacle.motion = { axis: 'x', amplitude: 3.2, speed: 1.2, phase: 0 }
      }
      next.obstacles.push(obstacle)
      selected = { kind: 'obstacle', id: obstacle.id }
    } else if (kind === 'coin') {
      const coin = { id: uid('n'), position: [at[0], at[1] + 1.2, at[2]] as Vec3 }
      next.coins.push(coin)
      selected = { kind: 'coin', id: coin.id }
    } else if (kind === 'checkpoint') {
      const checkpoint = { id: uid('k'), position: at, width: 8 }
      next.checkpoints.push(checkpoint)
      selected = { kind: 'checkpoint', id: checkpoint.id }
    } else if (kind === 'goal') {
      next.goal.position = at
      selected = { kind: 'goal', id: 'goal' }
    }
    persist(levelId, next)
    set({
      draft: next,
      selected,
      dirty: true,
      focusToken: selected ? get().focusToken + 1 : get().focusToken,
    })
    showMessage(set, kind === 'question' ? 'Pregunta añadida · edítala a la derecha' : 'Añadido')
  },

  deleteSelected: () => {
    const { draft, selected, levelId } = get()
    if (!draft || !selected) return
    if (selected.kind === 'goal' || selected.kind === 'start') {
      showMessage(set, 'No se puede borrar')
      return
    }
    get().beginUndo()
    const next = cloneLevel(draft)
    if (selected.kind === 'platform') next.platforms = next.platforms.filter((item) => item.id !== selected.id)
    if (selected.kind === 'challenge' || selected.kind === 'option') {
      next.challenges = next.challenges.filter((item) => item.id !== selected.id)
    }
    if (selected.kind === 'obstacle') next.obstacles = next.obstacles.filter((item) => item.id !== selected.id)
    if (selected.kind === 'coin') next.coins = next.coins.filter((item) => item.id !== selected.id)
    if (selected.kind === 'checkpoint') next.checkpoints = next.checkpoints.filter((item) => item.id !== selected.id)
    persist(levelId, next)
    set({ draft: next, selected: null, dirty: true })
  },

  resetToCode: () => {
    const { levelId } = get()
    clearDraft(levelId)
    unloadLevel(levelId)
    const draft = cloneLevel(getFactoryLevel(levelId))
    editorCursor.current = [...draft.start]
    set({ draft, selected: null, undoStack: [], dirty: false })
    showMessage(set, 'Restablecido al código')
  },

  playtest: () => {
    const { draft, levelId } = get()
    if (!draft) return
    persist(levelId, draft)
    unloadLevel(levelId)
    useGameStore.getState().startLevel(levelId, { fromEditor: true })
  },

  exportJson: async () => {
    const { draft } = get()
    if (!draft) return
    persist(get().levelId, draft)
    await navigator.clipboard.writeText(JSON.stringify(draft, null, 2))
    showMessage(set, 'JSON copiado')
  },

  exportTs: async () => {
    const { draft } = get()
    if (!draft) return
    persist(get().levelId, draft)
    await navigator.clipboard.writeText(exportLevelTs(draft))
    showMessage(set, 'TypeScript copiado')
  },
}))

function colorForPlatform(kind: PlatformKind) {
  if (kind === 'moving') return '#7ec8e3'
  if (kind === 'vanishing') return '#c9a0dc'
  if (kind === 'bounce') return '#88d498'
  if (kind === 'rotating') return '#f4a261'
  return '#6fa8dc'
}

export function patchMotion(
  current: PlatformDef['motion'] | ObstacleDef['motion'] | undefined,
  field: string,
  value: number | string,
) {
  const base = current ?? { axis: 'x' as const, amplitude: 3, speed: 1.2, phase: 0 }
  return { ...base, [field]: value }
}

export const CHALLENGE_TYPES: ChallengeType[] = ['grammar', 'vocabulary', 'listening', 'context']
export const PLATFORM_KINDS: PlatformKind[] = ['static', 'moving', 'vanishing', 'rotating', 'bounce', 'recovery']
export const OBSTACLE_KINDS: ObstacleKind[] = ['barrier', 'hammer', 'fan', 'spinner', 'movingBlock']
