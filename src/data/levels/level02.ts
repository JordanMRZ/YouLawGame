import { TrackBuilder } from '../trackBuilder'
import type { LevelDef } from '../types'
import { palettes } from '../worlds'

export function createLevel02(): LevelDef {
  const b = new TrackBuilder()
  b.pad(14, 18, { color: '#e09f3e' })
    .coinRow(3)
    .shift(4)
    .pad(12, 12, { color: '#f4a261' })
    .shift(4)
    .pad(11, 10, { color: '#e76f51' })
    .challenge({
      type: 'grammar',
      sentence: 'He ___ to school every morning.',
      options: ['GO', 'GOES', 'GOING'],
      correctAnswer: 'GOES',
    })
    .pad(12, 10, { color: '#2a9d8f' })
    .checkpoint()
    .pad(9, 8, {
      color: '#2a9d8f',
      kind: 'moving',
      motion: { axis: 'x', amplitude: 3.4, speed: 1.05 },
    })
    .gap(2.2)
    .shift(-6)
    .pad(11, 10, { color: '#e9c46a' })
    .challenge({
      type: 'grammar',
      sentence: 'She ___ English every day.',
      options: ['TEACH', 'TEACHES', 'TEACHING'],
      correctAnswer: 'TEACHES',
    })
    .pad(12, 10, { color: '#2a9d8f' })
    .checkpoint()
    .shift(-3)
    .gap(3.2)
    .pad(10, 9, { color: '#f4a261' })
    .pad(8, 8, {
      kind: 'moving',
      color: '#e76f51',
      motion: { axis: 'x', amplitude: 4, speed: 1.25 },
    })
    .challenge({
      type: 'grammar',
      sentence: 'The class ___ at eight.',
      options: ['START', 'STARTS', 'STARTING'],
      correctAnswer: 'STARTS',
    })
    .shift(5)
    .pad(12, 12, { color: '#2a9d8f' })
    .coinRow(4)
    .finish(5, 29)

  return b.build({
    id: 2,
    name: 'Daily Routine',
    subtitle: 'Third person. Keep your balance.',
    theme: 'Present Simple / 3rd person',
    world: 'school-path',
    hubLabel: 'SCHOOL',
    parTime: 92,
    palette: palettes['school-path'],
  })
}
