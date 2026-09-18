import { TrackBuilder } from '../trackBuilder'
import type { LevelDef } from '../types'
import { palettes } from '../worlds'

export function createLevel11(): LevelDef {
  const b = new TrackBuilder([0, 4, 0])
  b.pad(14, 16, { color: '#7e00d1' })
    .zone('1 BASIC PREPOSITIONS')
    .coinRow(4)
    .challenge({
      type: 'vocabulary',
      sentence: 'The apple is ___ the table.',
      options: ['IS', 'ON', 'UNDER'],
      correctAnswer: 'ON',
    })
    .pad(12, 10, { color: '#7e00d1' })
    .setY(4.2)
    .checkpoint()
    .zone('2  GRAMMAR')
    .challenge({
      type: 'grammar',
      sentence: 'By next year, she ___ at this school for a decade.',
      options: ['WILL HAVE TAUGHT', 'HAS TAUGHT', 'TAUGHT'],
      correctAnswer: 'WILL HAVE TAUGHT',
      spread: 7.4,
      length: 12,
    })
    .setY(4.2)
    .movingBlock(0, 2.2, 1.5, 1.8, 'x')
    .pad(12, 10, { color: '#7e00d1' })
    .checkpoint()
    .zone('3  LISTENING')
    .challenge({
      type: 'listening',
      hideSentence: true,
      audioText: 'I would like to raise a concern about the new timetable.',
      audioKey: 'lv10-1',
      sentence: 'I would like to ___ a concern about the new timetable.',
      options: ['RAISE', 'RISE', 'ARISE'],
      correctAnswer: 'RAISE',
    })
    .pad(12, 10, { color: '#e76f51' })
    .checkpoint()
    .zone('4  CONTEXT')
    .challenge({
      type: 'context',
      sentence: 'Let’s ___ the meeting until Thursday.',
      options: ['POSTPONE', 'PRETEND', 'PREVENT'],
      correctAnswer: 'POSTPONE',
    })
    .pad(11, 8, { color: '#f4a261' })
    .checkpoint()
    .zone('5  FINAL RUN')
    .hammer(0, 1.4)
    .pad(8, 6, { kind: 'vanishing', color: '#e9c46a' })
    .fan(3, 1.3)
    .pad(7, 6, {
      kind: 'moving',
      motion: { axis: 'x', amplitude: 3.8, speed: 1.5 },
      color: '#e76f51',
    })
    .challenge({
      type: 'grammar',
      sentence: 'If we had more time, we ___ expand the course.',
      options: ['WOULD', 'WILL', 'MUST'],
      correctAnswer: 'WOULD',
    })
    .pad(8, 7, { kind: 'bounce', color: '#ffd166' })
    .spinner(0, 1.7)
    .challenge({
      type: 'listening',
      hideSentence: true,
      audioText: 'Could you please share the minutes after the meeting?',
      audioKey: 'lv10-2',
      sentence: 'Could you please ___ the minutes after the meeting?',
      options: ['SHARE', 'SHORE', 'SHRED'],
      correctAnswer: 'SHARE',
    })
    .pad(14, 16, { color: '#2a9d8f' })
    .coinRow(6, 2)
    .finish(5, 29)

  return b.build({
    id: 11,
    name: 'Those who snow',
    subtitle: 'test',
    theme: 'Mixed mastery',
    world: 'bridge',
    hubLabel: 'ENGLISH BRIDGE',
    parTime: 150,
    start: [0, 6.2, 2.2],
    palette: palettes.bridge,
  })
}
