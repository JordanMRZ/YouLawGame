import { TrackBuilder } from '../trackBuilder'
import type { LevelDef, WorldId } from '../types'
import { palettes, worldMeta } from '../worlds'

export function createTemplateLevel(id: number, world: WorldId, localLevel: number): LevelDef {
  const b = new TrackBuilder([0, 2, 0])
  const color = palettes[world].accent
  const title = worldMeta[world].title

  // PLANTILLA DE LAYOUT: modifica esta cadena para diseñar tus niveles nuevos.
  b.pad(18, 20, { color })
    .coinRow(4)
    .gap(2)
    .pad(12, 10, { color })
    .challenge({
      type: 'grammar',
      sentence: 'WRITE YOUR QUESTION HERE.',
      options: ['OPTION A', 'OPTION B', 'OPTION C'],
      correctAnswer: 'OPTION A',
      lanes: [-5.5, 0, 5.5],
      length: 8,
    })
    .pad(14, 14, { color })
    .checkpoint()
    .gap(3)
    .pad(10, 12, { kind: 'moving', color, motion: { axis: 'x', amplitude: 2.5, speed: 1 } })
    .challenge({
      type: 'grammar',
      sentence: 'WRITE YOUR SECOND QUESTION HERE.',
      options: ['OPTION A', 'OPTION B', 'OPTION C'],
      correctAnswer: 'OPTION A',
      lanes: [5.5, -5.5, 0],
      length: 8,
    })
    .pad(16, 18, { color })
    .coinRow(5, 2)
    .finish(7, 22)

  return b.build({
    id,
    name: `${title} ${localLevel}`,
    subtitle: 'Plantilla editable de layout.',
    theme: 'Personaliza este tema',
    world,
    hubLabel: title.toUpperCase(),
    parTime: 90,
    start: [0, 4.2, 2.2],
    palette: palettes[world],
  })
}
