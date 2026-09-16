import { TrackBuilder } from '../trackBuilder'
import type { LevelDef } from '../types'
import { palettes } from '../worlds'

export function createLevel07(): LevelDef {
  const b = new TrackBuilder()
  b.pad(14, 16, { color: '#48cae4' })
    .coinRow(3)
    .challenge({
      type: 'grammar',
      sentence: 'If you finish your work, you ___ go home.',
      options: ['CAN', 'COULD', 'WOULD'],
      correctAnswer: 'CAN',
      lanes: [-7.5, 0, 7.5],
      spread: 7.5,
    })
    .pad(8, 8, { color: '#90e0ef' })
    .checkpoint()
    .platformAt([-9, 1.8, b.cursor()[2] + 10], [7, 0.72, 18], { color: '#80ed99' })
    .platformAt([9, 0, b.cursor()[2] + 10], [7, 0.72, 18], { color: '#00b4d8' })
    .coinAt([-9, 3.4, 8])
    .coinAt([-9, 3.4, 12])
    .gap(18)
    .setX(0)
    .pad(12, 10, { color: '#48cae4' })
    .zone('SECRET PATH REJOINS')
    .challenge({
      type: 'grammar',
      sentence: 'If I were you, I ___ talk to her.',
      options: ['WOULD', 'WILL', 'CAN'],
      correctAnswer: 'WOULD',
    })
    .pad(11, 9, { color: '#0077b6' })
    .checkpoint()
    .platformAt([-8, 2.4, b.cursor()[2] + 8], [6, 0.72, 14], { color: '#caf0f8' })
    .platformAt([8, -0.4, b.cursor()[2] + 8], [6, 0.72, 14], { color: '#023e8a' })
    .gap(14)
    .pad(12, 10, { color: '#48cae4' })
    .challenge({
      type: 'grammar',
      sentence: 'If he had studied, he ___ have passed.',
      options: ['WOULD', 'WILL', 'CAN'],
      correctAnswer: 'WOULD',
    })
    .pad(13, 12, { color: '#0077b6' })
    .coinRow(5)
    .finish(5, 29)

  return b.build({
    id: 7,
    name: 'The Long Sentence',
    subtitle: 'One choice. Two skies. One landing.',
    theme: 'Conditionals',
    world: 'sky',
    hubLabel: 'SKY ISLANDS',
    parTime: 120,
    palette: palettes.sky,
  })
}
