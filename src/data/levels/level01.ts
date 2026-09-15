import { TrackBuilder } from '../trackBuilder'
import type { LevelDef } from '../types'
import { palettes } from '../worlds'

export function createLevel01(): LevelDef {
  const b = new TrackBuilder()
  b.pad(22, 26, { color: '#46d07f' })
    .coinRow(4, 2.4)
    .barrier()
    .pad(20, 14, { color: '#52d68a' })
    .gap(3.1)
    .pad(12, 10, { color: '#63dc96' })
    .challenge({
      type: 'grammar',
      sentence: 'She ___ a teacher.',
      options: ['IS', 'ARE', 'AM'],
      correctAnswer: 'IS',
      lanes: [-6.2, 0, 6.2],
    })
    .pad(14, 16, { color: '#46d07f' })
    .checkpoint()
    .coinRow(3)
    .gap(2.8)
    .pad(11, 10, { color: '#3cbc7a' })
    .challenge({
      type: 'grammar',
      sentence: 'They ___ in the staff room.',
      options: ['ARE', 'IS', 'AM'],
      correctAnswer: 'ARE',
      lanes: [6.2, -6.2, 0],
    })
    .pad(14, 16, { color: '#46d07f' })
    .checkpoint()
    .barrier()
    .pad(12, 12, { color: '#5ad48e' })
    .gap(3.4)
    .pad(10, 8, { color: '#3cbc7a' })
    .challenge({
      type: 'grammar',
      sentence: 'I ___ ready for class.',
      options: ['AM', 'IS', 'ARE'],
      correctAnswer: 'AM',
      lanes: [0, 6.2, -6.2],
    })
    .pad(14, 12, { color: '#46d07f' })
    .coinRow(4, 2)
    .finish(16, 20)

  return b.build({
    id: 1,
    name: 'First Steps',
    subtitle: 'Learn the rhythm. Keep moving.',
    theme: 'Present Simple',
    world: 'training',
    hubLabel: 'TRAINING ISLAND',
    parTime: 78,
    palette: palettes.training,
  })
}
