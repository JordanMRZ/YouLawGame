import type { LevelDef } from './types'
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

export const LEVEL_COUNT = 10

export const levelCatalog = [
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
]

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
}

const cache = new Map<number, LevelDef>()

export function getLevel(id: number): LevelDef {
  const existing = cache.get(id)
  if (existing) return existing
  const factory = factories[id] ?? createLevel01
  const level = factory()
  cache.set(id, level)
  return level
}

export function unloadLevel(id: number) {
  cache.delete(id)
}
