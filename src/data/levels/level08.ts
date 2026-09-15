import { TrackBuilder } from '../trackBuilder'
import type { LevelDef } from '../types'
import { palettes } from '../worlds'

export function createLevel08(): LevelDef {
  const b = new TrackBuilder()
  b.pad(13, 14, { color: '#6c584c' })
    .hammer(0, 1.3)
    .pad(11, 8, { color: '#a98467' })
    .challenge({
      type: 'grammar',
      sentence: 'The deadline is ___ Friday.',
      options: ['ON', 'IN', 'AT'],
      correctAnswer: 'ON',
    })
    .pad(11, 8, { color: '#adc178' })
    .checkpoint()
    .spinner(0, 1.6)
    .pad(9, 7, { kind: 'rotating', color: '#dda15e', rotationSpeed: 0.7 })
    .fan(4, 1.4)
    .gap(2.6)
    .pad(8, 7, { kind: 'bounce', color: '#f77f00' })
    .challenge({
      type: 'vocabulary',
      sentence: 'We need to ___ the agenda.',
      options: ['REVIEW', 'REVISE', 'REVERT'],
      correctAnswer: 'REVIEW',
    })
    .pad(10, 8, { color: '#6c584c' })
    .checkpoint()
    .movingBlock(-2)
    .pad(8, 6, { kind: 'vanishing', color: '#bc4749' })
    .hammer(2, 1.5)
    .challenge({
      type: 'listening',
      hideSentence: true,
      audioText: 'You must submit the form before noon.',
      audioKey: 'lv8-1',
      sentence: 'You ___ submit the form before noon.',
      options: ['MUST', 'MIGHT', 'WOULD'],
      correctAnswer: 'MUST',
    })
    .pad(10, 8, { color: '#adc178' })
    .pad(7, 6, {
      kind: 'moving',
      motion: { axis: 'x', amplitude: 4.5, speed: 1.45 },
      color: '#f77f00',
    })
    .challenge({
      type: 'grammar',
      sentence: 'If the printer fails, we ___ use the backup.',
      options: ['CAN', 'WOULD', 'MUSTN\'T'],
      correctAnswer: 'CAN',
    })
    .pad(12, 12, { color: '#6c584c' })
    .coinRow(5)
    .finish(14, 16)

  return b.build({
    id: 8,
    name: 'Chaos Bridge',
    subtitle: 'Grammar in the middle of the storm.',
    theme: 'Mixed skills',
    world: 'chaos',
    hubLabel: 'CHAOS FACTORY',
    parTime: 130,
    palette: palettes.chaos,
  })
}
