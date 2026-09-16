import { TrackBuilder } from '../trackBuilder'
import type { LevelDef } from '../types'
import { palettes } from '../worlds'

export function createLevel09(): LevelDef {
  const b = new TrackBuilder()
  b.pad(16, 18, { color: '#adb5bd' })
    .zone('CLASSROOM')
    .coinRow(3)
    .challenge({
      type: 'context',
      sentence: 'Please ___ your books to page twelve.',
      options: ['OPEN', 'START', 'BEGIN'],
      correctAnswer: 'OPEN',
    })
    .pad(10, 12, { color: '#ced4da' })
    .checkpoint()
    .pad(16, 16, { color: '#868e96' })
    .zone('STAFF ROOM')
    .challenge({
      type: 'context',
      sentence: 'Could you ___ me with this photocopy?',
      options: ['HELP', 'MAKE', 'GIVE'],
      correctAnswer: 'HELP',
    })
    .pad(10, 10, { color: '#ced4da' })
    .checkpoint()
    .pad(16, 16, { color: '#495057' })
    .zone('MEETING ROOM')
    .challenge({
      type: 'context',
      sentence: 'We need to ___ the problem before Friday.',
      options: ['ADDRESS', 'SPEAK', 'TELL'],
      correctAnswer: 'ADDRESS',
    })
    .pad(10, 10, { color: '#ced4da' })
    .checkpoint()
    .pad(16, 18, { color: '#343a40' })
    .zone("PRINCIPAL'S OFFICE")
    .challenge({
      type: 'context',
      sentence: 'I would like to ___ a suggestion.',
      options: ['MAKE', 'SAY', 'DO'],
      correctAnswer: 'MAKE',
    })
    .pad(14, 14, { color: '#4c6ef5' })
    .coinRow(5)
    .finish(5, 29)

  return b.build({
    id: 9,
    name: "Teacher's Challenge",
    subtitle: 'Real staff-room English. Walk the school.',
    theme: 'Professional classroom English',
    world: 'international',
    hubLabel: 'INTERNATIONAL SCHOOL',
    parTime: 125,
    palette: palettes.international,
  })
}
