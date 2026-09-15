import { TrackBuilder } from '../trackBuilder'
import type { LevelDef } from '../types'
import { palettes } from '../worlds'

export function createLevel03(): LevelDef {
  const b = new TrackBuilder()
  b.pad(13, 16, { color: '#7b68ee' })
    .coinRow(3)
    .gap(3.4)
    .setY(1.6)
    .pad(10, 8, { color: '#9b8cff' })
    .challenge({
      type: 'grammar',
      sentence: 'The book is ___ the table.',
      options: ['ON', 'UNDER', 'BETWEEN'],
      correctAnswer: 'ON',
    })
    .pad(11, 9, { color: '#6c63ff' })
    .checkpoint()
    .pad(8, 7, { kind: 'vanishing', color: '#c77dff' })
    .gap(1.6)
    .setY(3.2)
    .pad(8, 7, { kind: 'vanishing', color: '#e0aaff' })
    .gap(2.8)
    .setY(1.4)
    .pad(10, 8, { color: '#7b68ee' })
    .challenge({
      type: 'grammar',
      sentence: 'She sat ___ the two groups.',
      options: ['BETWEEN', 'ON', 'ABOVE'],
      correctAnswer: 'BETWEEN',
    })
    .pad(11, 8, { color: '#5a4fcf' })
    .checkpoint()
    .setY(3.2)
    .gap(3)
    .pad(7.5, 6.5, { color: '#9b8cff' })
    .pad(7, 6, { kind: 'vanishing', color: '#ffc6ff' })
    .challenge({
      type: 'grammar',
      sentence: 'Put the papers ___ the folder.',
      options: ['IN', 'AT', 'ON'],
      correctAnswer: 'IN',
    })
    .setY(1.2)
    .pad(12, 12, { color: '#6c63ff' })
    .coinRow(4)
    .finish(14, 16)

  return b.build({
    id: 3,
    name: 'Time to Move',
    subtitle: 'Heights, gaps, disappearing ground.',
    theme: 'Prepositions',
    world: 'time',
    hubLabel: 'CITY',
    parTime: 100,
    palette: palettes.time,
  })
}
