import type { ChallengeDef, ChallengeDraft, CoinDef, LevelDef, ObstacleDef, PlatformDef, Vec3 } from './types'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = copy[i]
    const swap = copy[j]
    if (current === undefined || swap === undefined) continue
    copy[i] = swap
    copy[j] = current
  }
  return copy
}

export class TrackBuilder {
  private x: number
  private y: number
  private z: number
  private n = 0
  readonly platforms: PlatformDef[] = []
  readonly challenges: ChallengeDef[] = []
  readonly obstacles: ObstacleDef[] = []
  readonly coins: CoinDef[] = []
  readonly checkpoints: { id: string; position: Vec3 }[] = []
  readonly zones: { id: string; label: string; position: Vec3 }[] = []
  goal: { position: Vec3; size?: Vec3 } = { position: [0, 1, 20] }

  constructor(start: Vec3 = [0, 0, 0]) {
    this.x = start[0]
    this.y = start[1]
    this.z = start[2]
  }

  private id(prefix: string) {
    this.n += 1
    return `${prefix}${this.n}`
  }

  cursor(): Vec3 {
    return [this.x, this.y, this.z]
  }

  pad(width: number, length: number, extras: Partial<PlatformDef> = {}) {
    const height = extras.size?.[1] ?? 0.72
    this.platforms.push({
      id: extras.id ?? this.id('p'),
      position: [this.x, this.y, this.z + length / 2],
      size: [width, height, length],
      kind: extras.kind ?? 'static',
      color: extras.color,
      motion: extras.motion,
      rotationSpeed: extras.rotationSpeed,
    })
    this.z += length
    return this
  }

  platformAt(position: Vec3, size: Vec3, extras: Partial<PlatformDef> = {}) {
    this.platforms.push({
      id: extras.id ?? this.id('p'),
      position,
      size,
      kind: extras.kind ?? 'static',
      color: extras.color,
      motion: extras.motion,
      rotationSpeed: extras.rotationSpeed,
    })
    return this
  }

  gap(length: number) {
    this.z += length
    return this
  }

  shift(dx: number, dy = 0) {
    this.x += dx
    this.y += dy
    return this
  }

  setX(x: number) {
    this.x = x
    return this
  }

  setY(y: number) {
    this.y = y
    return this
  }

  checkpoint() {
    this.checkpoints.push({
      id: this.id('cp'),
      position: [this.x, this.y + 1.15, this.z - 0.6],
    })
    return this
  }

  zone(label: string) {
    this.zones.push({
      id: this.id('zn'),
      label,
      position: [this.x, this.y + 3.4, this.z + 2],
    })
    return this
  }

  coinRow(count = 3, spacing = 2.2, height = 1.55) {
    for (let i = 0; i < count; i++) {
      this.coins.push({
        id: this.id('c'),
        position: [this.x, this.y + height, this.z + 1 + i * spacing],
      })
    }
    return this
  }

  coinAt(offset: Vec3) {
    this.coins.push({
      id: this.id('c'),
      position: [this.x + offset[0], this.y + offset[1], this.z + offset[2]],
    })
    return this
  }

  barrier(width = 2.2, height = 1.05) {
    this.obstacles.push({
      id: this.id('ob'),
      kind: 'barrier',
      position: [this.x, this.y + height / 2 + 0.36, this.z + 1],
      size: [width, height, 0.7],
    })
    return this
  }

  hammer(offsetX = 0, speed = 1.1) {
    this.obstacles.push({
      id: this.id('hm'),
      kind: 'hammer',
      position: [this.x + offsetX, this.y + 2.4, this.z + 1],
      speed,
    })
    return this
  }

  fan(offsetX = 0, speed = 1) {
    this.obstacles.push({
      id: this.id('fn'),
      kind: 'fan',
      position: [this.x + offsetX, this.y + 1.4, this.z + 1],
      speed,
      size: [2.4, 2.2, 2.4],
    })
    return this
  }

  spinner(offsetX = 0, speed = 1.4) {
    this.obstacles.push({
      id: this.id('sp'),
      kind: 'spinner',
      position: [this.x + offsetX, this.y + 1.2, this.z + 1],
      speed,
    })
    return this
  }

  movingBlock(offsetX = 0) {
    this.obstacles.push({
      id: this.id('mb'),
      kind: 'movingBlock',
      position: [this.x + offsetX, this.y + 1.3, this.z + 1],
      size: [1.6, 1.6, 1.6],
      speed: 1.2,
    })
    return this
  }

  challenge(draft: ChallengeDraft) {
    const length = draft.length ?? 10
    const spread = draft.spread ?? 6.2
    const origin: Vec3 = [this.x, this.y, this.z + length / 2]
    const size: Vec3 = [4.5, 0.72, length]
    const defaultLanes: [number, number, number] = [-spread, 0, spread]
    const lanes = draft.lanes ?? (shuffle(defaultLanes) as [number, number, number])

    const options = draft.options.map((word, index) => ({
      word,
      offset: [lanes[index] ?? 0, 0, 0] as Vec3,
    }))

    this.challenges.push({
      id: this.id('q'),
      type: draft.type,
      sentence: draft.sentence,
      audioText: draft.audioText,
      audioKey: draft.audioKey,
      origin,
      options,
      correctAnswer: draft.correctAnswer,
      platformSize: size,
      hideSentence: draft.hideSentence,
    })

    this.platforms.push({
      id: this.id('net'),
      position: [this.x, this.y - 6.5, origin[2]],
      size: [spread * 2 + 12, 0.4, length + 6],
      kind: 'recovery',
      color: '#7ec8e3',
    })

    this.z += length + 1.2
    return this
  }

  finish(width = 16, length = 18) {
    this.goal = {
      position: [this.x, this.y + 1.2, this.z + 4],
      size: [8, 4, 2],
    }
    this.pad(width, length)
    return this
  }

  build(meta: Omit<LevelDef, 'platforms' | 'challenges' | 'obstacles' | 'coins' | 'checkpoints' | 'goal' | 'start'> & { start?: Vec3 }): LevelDef {
    return {
      ...meta,
      start: meta.start ?? [0, 1.4, 3],
      platforms: this.platforms,
      challenges: this.challenges,
      obstacles: this.obstacles,
      coins: this.coins,
      checkpoints: this.checkpoints,
      goal: this.goal,
      zones: this.zones,
    }
  }
}
