import { TrackBuilder } from '../trackBuilder'
import type { LevelDef } from '../types'
import { palettes } from '../worlds'

export function createLevel05(): LevelDef {
  const b = new TrackBuilder()
  b.pad(12, 20, { color: '#3c096c' })
    .coinRow(4)
    .challenge({
      type: 'listening',
      hideSentence: true,
      audioText: 'They have been working here for three years.',
      audioKey: 'lv5-1',
      sentence: 'They ___ been working here for three years.',
      options: ['HAVE', 'HAS', 'HAD'],
      correctAnswer: 'HAVE',
    })
    .pad(11, 10, { color: '#5a189a' })
    .checkpoint()
    .pad(8, 8, {
      kind: 'moving',
      color: '#ff2e97',
      motion: { axis: 'x', amplitude: 3.2, speed: 1.4 },
    })
    .challenge({
      type: 'listening',
      hideSentence: true,
      audioText: 'She has already finished the report.',
      audioKey: 'lv5-2',
      sentence: 'She ___ already finished the report.',
      options: ['HAVE', 'HAS', 'HAD'],
      correctAnswer: 'HAS',
    })
    .pad(11, 10, { color: '#7b2cbf' })
    .checkpoint()
    .fan(3, 1.2)
    .pad(10, 8, { color: '#9d4edd' })
    .challenge({
      type: 'listening',
      hideSentence: true,
      audioText: 'We were discussing the schedule when you called.',
      audioKey: 'lv5-3',
      sentence: 'We ___ discussing the schedule when you called.',
      options: ['WAS', 'WERE', 'BEEN'],
      correctAnswer: 'WERE',
    })
    .pad(12, 12, { color: '#3c096c' })
    .coinRow(4)
    .finish(13, 16)

  return b.build({
    id: 5,
    name: 'Listen!',
    subtitle: 'Trust your ear. Keep moving.',
    theme: 'Listening',
    world: 'neon',
    hubLabel: 'NEON CITY',
    parTime: 88,
    autoRun: true,
    palette: palettes.neon,
  })
}
