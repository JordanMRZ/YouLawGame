import { defaultCosmetics, starterOwned } from './shop'
import type { Cosmetics, GlassesStyle, PackStyle, SaveAdapter, SaveData, Settings } from './types'

const KEY = 'word-bridge-3d-save-v1'

export { defaultCosmetics } from './shop'

export const defaultSettings: Settings = {
  sfx: 0.85,
  music: 0.35,
  muted: false,
}

function migrateCosmetics(raw: Record<string, unknown>): Cosmetics {
  const glassesRaw = raw.glasses
  const packRaw = raw.backpack
  const glasses: GlassesStyle =
    glassesRaw === true || glassesRaw === 'square'
      ? 'square'
      : glassesRaw === 'round' || glassesRaw === 'sun' || glassesRaw === 'none'
        ? glassesRaw
        : defaultCosmetics.glasses
  const backpack: PackStyle =
    packRaw === true || packRaw === 'pack'
      ? 'pack'
      : packRaw === 'satchel' || packRaw === 'none'
        ? packRaw
        : defaultCosmetics.backpack
  return {
    ...defaultCosmetics,
    ...(raw as Partial<Cosmetics>),
    glasses,
    backpack,
  }
}

export function createDefaultSave(): SaveData {
  return {
    unlockedLevel: 1,
    xp: 0,
    wallet: 24,
    owned: [...starterOwned],
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
      const parsed = JSON.parse(raw) as Partial<SaveData> & { cosmetics?: Partial<Cosmetics> }
      const base = createDefaultSave()
      return {
        ...base,
        ...parsed,
        wallet: typeof parsed.wallet === 'number' ? parsed.wallet : base.wallet,
        owned: Array.isArray(parsed.owned) ? Array.from(new Set([...starterOwned, ...parsed.owned])) : base.owned,
        settings: { ...defaultSettings, ...parsed.settings },
        cosmetics: migrateCosmetics((parsed.cosmetics ?? {}) as Record<string, unknown>),
        totals: { ...base.totals, ...parsed.totals },
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
