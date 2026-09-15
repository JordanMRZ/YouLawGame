import type { Cosmetics, SaveAdapter, SaveData, Settings } from './types'

const KEY = 'word-bridge-3d-save-v1'

export const defaultCosmetics: Cosmetics = {
  shirt: '#1f6f8b',
  glasses: true,
  backpack: false,
}

export const defaultSettings: Settings = {
  sfx: 0.85,
  music: 0.35,
  muted: false,
}

export function createDefaultSave(): SaveData {
  return {
    unlockedLevel: 1,
    xp: 0,
    levels: {},
    settings: { ...defaultSettings },
    cosmetics: { ...defaultCosmetics },
    totals: { time: 0, mistakes: 0, bestStreak: 0, stars: 0 },
  }
}

export const localStorageAdapter: SaveAdapter = {
  load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as SaveData
      return {
        ...createDefaultSave(),
        ...parsed,
        settings: { ...defaultSettings, ...parsed.settings },
        cosmetics: { ...defaultCosmetics, ...parsed.cosmetics },
        totals: { ...createDefaultSave().totals, ...parsed.totals },
        levels: parsed.levels ?? {},
      }
    } catch {
      return null
    }
  },
  save(data) {
    localStorage.setItem(KEY, JSON.stringify(data))
  },
}

/**
 * Swap this adapter for a Firebase implementation later:
 * setSaveAdapter({ load, save })
 */
let adapter: SaveAdapter = localStorageAdapter

export function setSaveAdapter(next: SaveAdapter) {
  adapter = next
}

export function getSaveAdapter(): SaveAdapter {
  return adapter
}

export function loadSave(): SaveData {
  return adapter.load() ?? createDefaultSave()
}

export function persistSave(data: SaveData) {
  adapter.save(data)
}
