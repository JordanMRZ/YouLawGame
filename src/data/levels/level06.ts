import { TrackBuilder } from '../trackBuilder'
import type { LevelDef } from '../types'
import { palettes } from '../worlds'

export function createLevel06(): LevelDef {
  const b = new TrackBuilder([0, 8, 0])
  b.pad(10, 14, { color: '#74c69d' })
    .coinRow(3)
    .gap(3.6)
    .setY(5)
    .pad(6.2, 6, { color: '#95d5b2' })
    .challenge({
      type: 'grammar',
      sentence: 'You ___ wear a helmet here.',
      options: ['MUST', 'CAN', 'MIGHT'],
      correctAnswer: 'MUST',
      spread: 5.4,
      length: 8,
    })
    .setY(5)
    .pad(9, 8, { color: '#52b788' })
    .checkpoint()
    .gap(3.2)
    .setY(5)
    .pad(5.4, 5.5, {
      kind: 'moving',
      color: '#d8f3dc',
      motion: { axis: 'x', amplitude: 3.6, speed: 1.2 },
    })
    .gap(2.4)
    .pad(5.2, 5.5, { color: '#95d5b2' })
    .challenge({
      type: 'grammar',
      sentence: 'We ___ postpone the meeting if needed.',
      options: ['SHOULD', 'MUSTN\'T', 'CAN\'T'],
      correctAnswer: 'SHOULD',
      spread: 5.2,
      length: 8,
    })
    .setY(5)
    .pad(8, 8, { color: '#40916c' })
    .checkpoint()
    .pad(5, 6, { kind: 'vanishing', color: '#b7e4c7' })
    .gap(2)
    .setY(6)
    .pad(4.8, 5, { color: '#d8f3dc' })
    .challenge({
      type: 'grammar',
      sentence: 'Students ___ leave early today.',
      options: ['MAY', 'MUST', 'WOULD'],
      correctAnswer: 'MAY',
      spread: 5,
      length: 8,
    })
    .setY(5)
    .pad(10, 12, { color: '#52b788' })
    .coinRow(4)
    .finish(12, 16)

  return b.build({
    id: 6,
    name: "Don't Fall",
    subtitle: 'Narrow paths. High stakes. Modals.',
    theme: 'Modal verbs',
    world: 'mountain',
    hubLabel: 'MOUNTAIN',
    parTime: 115,
    start: [0, 10.2, 2.2],
    palette: palettes.mountain,
  })
}
