import type { LevelDef } from './types'

const KEY = 'you-law-editor-draft-v1'

type DraftMap = Record<string, LevelDef>

function readAll(): DraftMap {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as DraftMap
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAll(map: DraftMap) {
  localStorage.setItem(KEY, JSON.stringify(map))
}

export function peekDraft(id: number): LevelDef | null {
  const draft = readAll()[String(id)]
  return draft ?? null
}

export function saveDraft(id: number, level: LevelDef) {
  const map = readAll()
  map[String(id)] = level
  writeAll(map)
}

export function clearDraft(id: number) {
  const map = readAll()
  delete map[String(id)]
  writeAll(map)
}

export function hasDraft(id: number) {
  return peekDraft(id) !== null
}

export function listDraftIds(): number[] {
  return Object.keys(readAll())
    .map(Number)
    .filter((id) => Number.isFinite(id))
}
