import { TrackBuilder } from '../trackBuilder'
import type { LevelDef } from '../types'
import { palettes } from '../worlds'

export function createLevel04(): LevelDef {
  const b = new TrackBuilder()
  b.pad(14, 16, { color: '#bc6c25' })
    .coinRow(3)
    .hammer(0, 1)
    .pad(12, 10, { color: '#dda15e' })
    .challenge({
      type: 'grammar',
      sentence: 'She ___ the lesson yesterday.',
      options: ['TEACH', 'TAUGHT', 'TEACHING'],
      correctAnswer: 'TAUGHT',
    })
    .pad(12, 10, { color: '#606c38' })
    .checkpoint()
    .movingBlock(2)
    .pad(11, 9, { color: '#bc6c25' })
    .pad(8, 8, {
      kind: 'moving',
      color: '#e09f3e',
      motion: { axis: 'x', amplitude: 4.2, speed: 1.15 },
    })
    
    .challenge({
      type: 'grammar',
      sentence: 'They ___ the exam last week.',
      options: ['TAKE', 'TOOK', 'TAKEN'],
      correctAnswer: 'TOOK',
    })
    .pad(12, 10, { color: '#606c38' })
    .checkpoint()
    .hammer(-2, 1.25)
    .pad(10, 8, { color: '#dda15e' })
    .gap(3)
    .pad(9, 8, {
      kind: 'moving',
      motion: { axis: 'z', amplitude: 2.2, speed: 1.3 },
      color: '#bc6c25',
    })
    .challenge({
      type: 'grammar',
      sentence: 'He ___ late to the meeting.',
      options: ['ARRIVES', 'ARRIVED', 'ARRIVING'],
      correctAnswer: 'ARRIVED',
    })
    .pad(13, 12, { color: '#606c38' })
    .coinRow(5)
    .finish(5, 29)

  return b.build({
    id: 4,
    name: 'What Happened?',
    subtitle: 'Mechanical obstacles. Past forms.',
    theme: 'Past Simple',
    world: 'industrial',
    hubLabel: 'INDUSTRIAL ZONE',
    parTime: 108,
    palette: palettes.industrial,
  })
}
