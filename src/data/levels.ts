import { peekDraft } from './editorDrafts'
import type { LevelDef, WorldId } from './types'
import { createLevel01 } from './levels/level01'
import { createLevel02 } from './levels/level02'
import { createLevel03 } from './levels/level03'
import { createLevel04 } from './levels/level04'
import { createLevel05 } from './levels/level05'
import { createLevel06 } from './levels/level06'
import { createLevel07 } from './levels/level07'
import { createLevel08 } from './levels/level08'
import { createLevel09 } from './levels/level09'
import { createLevel10 } from './levels/level10'
import { createLevel11 } from './levels/level11'
import { createTemplateLevel } from './levels/templateLevel'

export const LEVEL_COUNT = 50

export const WORLD_COUNT = 10
export const LEVELS_PER_WORLD = 5

export const worldOrder: WorldId[] = [
  'training',
  'school-path',
  'time',
  'industrial',
  'neon',
  'mountain',
  'sky',
  'chaos',
  'international',
  'bridge',
]

export function worldForLevel(id: number): WorldId {
  return worldOrder[Math.min(worldOrder.length - 1, Math.floor((id - 1) / LEVELS_PER_WORLD))] ?? 'training'
}

export function localLevelForId(id: number) {
  return ((id - 1) % LEVELS_PER_WORLD) + 1
}

const legacyCatalog = [
  { id: 1, name: 'First Steps', subtitle: 'Learn the rhythm. Keep moving.', theme: 'Present Simple', hubLabel: 'TRAINING ISLAND', world: 'training' as const },
  { id: 2, name: 'Daily Routine', subtitle: 'Third person. Keep your balance.', theme: 'Present Simple / 3rd person', hubLabel: 'SCHOOL', world: 'school-path' as const },
  { id: 3, name: 'Time to Move', subtitle: 'Heights, gaps, disappearing ground.', theme: 'Prepositions', hubLabel: 'CITY', world: 'time' as const },
  { id: 4, name: 'What Happened?', subtitle: 'Mechanical obstacles. Past forms.', theme: 'Past Simple', hubLabel: 'INDUSTRIAL ZONE', world: 'industrial' as const },
  { id: 5, name: 'Listen!', subtitle: 'Trust your ear. Keep moving.', theme: 'Listening', hubLabel: 'NEON CITY', world: 'neon' as const },
  { id: 6, name: "Don't Fall", subtitle: 'Narrow paths. High stakes. Modals.', theme: 'Modal verbs', hubLabel: 'MOUNTAIN', world: 'mountain' as const },
  { id: 7, name: 'The Long Sentence', subtitle: 'One choice. Two skies. One landing.', theme: 'Conditionals', hubLabel: 'SKY ISLANDS', world: 'sky' as const },
  { id: 8, name: 'Chaos Bridge', subtitle: 'Grammar in the middle of the storm.', theme: 'Mixed skills', hubLabel: 'CHAOS FACTORY', world: 'chaos' as const },
  { id: 9, name: "Teacher's Challenge", subtitle: 'Real staff-room English. Walk the school.', theme: 'Professional classroom English', hubLabel: 'INTERNATIONAL SCHOOL', world: 'international' as const },
  { id: 10, name: 'The Final Bridge', subtitle: 'Everything you learned. One last crossing.', theme: 'Mixed mastery', hubLabel: 'ENGLISH BRIDGE', world: 'bridge' as const },
  { id: 11, name: 'Those who snow', subtitle: 'test', theme: 'Mixed mastery', hubLabel: 'ENGLISH BRIDGE', world: 'bridge' as const },

]

export const levelCatalog = Array.from({ length: LEVEL_COUNT }, (_, index) => {
  const id = index + 1
  const world = worldForLevel(id)
  const localLevel = localLevelForId(id)
  const legacy = legacyCatalog[id - 1]
  return legacy
    ? { ...legacy, id, world, localLevel, hubLabel: world.replace('-', ' ').toUpperCase() }
    : {
        id,
        localLevel,
        name: `${world.replace('-', ' ')} template ${localLevel}`,
        subtitle: 'Plantilla editable de layout.',
        theme: 'Personaliza este mundo',
        hubLabel: world.replace('-', ' ').toUpperCase(),
        world,
      }
})

const factories: Record<number, () => LevelDef> = {
  1: createLevel01,
  2: createLevel02,
  3: createLevel03,
  4: createLevel04,
  5: createLevel05,
  6: createLevel06,
  7: createLevel07,
  8: createLevel08,
  9: createLevel09,
  10: createLevel10,
  11: createLevel11,
}

for (let id = 12; id <= LEVEL_COUNT; id += 1) {
  const world = worldForLevel(id)
  const localLevel = localLevelForId(id)
  factories[id] = () => createTemplateLevel(id, world, localLevel)
}

const cache = new Map<number, LevelDef>()

function buildFactoryLevel(id: number): LevelDef {
  const existing = cache.get(id)
  if (existing) return existing
  const factory = factories[id] ?? (() => createTemplateLevel(id, worldForLevel(id), localLevelForId(id)))
  const level = factory()
  cache.set(id, level)
  return level
}

export function getFactoryLevel(id: number): LevelDef {
  return structuredClone(buildFactoryLevel(id))
}

export function getLevel(id: number): LevelDef {
  const draft = peekDraft(id)
  if (draft) return structuredClone(draft)
  return buildFactoryLevel(id)
}

export function unloadLevel(id: number) {
  cache.delete(id)
}
