export type Vec3 = [number, number, number]

export type ChallengeType = 'grammar' | 'vocabulary' | 'listening' | 'context'

export type PlatformKind =
  | 'static'
  | 'moving'
  | 'vanishing'
  | 'rotating'
  | 'bounce'
  | 'recovery'

export type ObstacleKind = 'barrier' | 'hammer' | 'fan' | 'spinner' | 'movingBlock'

export type WorldId =
  | 'training'
  | 'school-path'
  | 'time'
  | 'industrial'
  | 'neon'
  | 'mountain'
  | 'sky'
  | 'chaos'
  | 'international'
  | 'bridge'

export type AnimState = 'idle' | 'run' | 'jump' | 'fall' | 'land' | 'victory'

export type GamePhase =
  | 'hub'
  | 'intro'
  | 'tutorial'
  | 'countdown'
  | 'play'
  | 'paused'
  | 'results'
  | 'failed'
  | 'credits'

export interface MotionDef {
  axis: 'x' | 'y' | 'z'
  amplitude: number
  speed: number
  phase?: number
}

export interface PlatformDef {
  id: string
  position: Vec3
  size: Vec3
  kind?: PlatformKind
  color?: string
  motion?: MotionDef
  rotationSpeed?: number
}

export interface ChallengeOption {
  word: string
  offset: Vec3
}

export interface ChallengeDef {
  id: string
  type: ChallengeType
  sentence?: string
  audioText?: string
  audioKey?: string
  origin: Vec3
  options: ChallengeOption[]
  correctAnswer: string
  platformSize?: Vec3
  hideSentence?: boolean
  explanation?: string
  wrongWhy?: Record<string, string>
  timeLimit?: number
}

export interface CheckpointDef {
  id: string
  position: Vec3
  width?: number
}

export interface ObstacleDef {
  id: string
  kind: ObstacleKind
  position: Vec3
  size?: Vec3
  speed?: number
  color?: string
}

export interface CoinDef {
  id: string
  position: Vec3
}

export interface ZoneDef {
  id: string
  label: string
  position: Vec3
}

export interface LevelPalette {
  fog: string
  skyTop: string
  skyBottom: string
  ambient: string
  ground: string
  accent: string
  water: string
}

export interface LevelDef {
  id: number
  name: string
  subtitle: string
  theme: string
  world: WorldId
  hubLabel: string
  parTime: number
  autoRun?: boolean
  start: Vec3
  checkpoints: CheckpointDef[]
  goal: { position: Vec3; size?: Vec3 }
  platforms: PlatformDef[]
  challenges: ChallengeDef[]
  obstacles: ObstacleDef[]
  coins: CoinDef[]
  zones?: ZoneDef[]
  palette: LevelPalette
}

export type HairStyle = 'short' | 'spike' | 'bun' | 'long'
export type ShirtStyle = 'tee' | 'hoodie' | 'blazer'
export type GlassesStyle = 'none' | 'round' | 'square' | 'sun'
export type HatStyle = 'none' | 'cap' | 'beanie' | 'bow'
export type PackStyle = 'none' | 'pack' | 'satchel'
export type ShopCategory = 'skin' | 'hair' | 'shirt' | 'pants' | 'shoes' | 'glasses' | 'hat' | 'pack' | 'extra'

export interface Cosmetics {
  skin: string
  hair: string
  hairStyle: HairStyle
  shirt: string
  shirtStyle: ShirtStyle
  pants: string
  shoes: string
  glasses: GlassesStyle
  hat: HatStyle
  backpack: PackStyle
  scarf: boolean
  watch: boolean
  car: boolean
  tank: boolean
}

export interface ShopItem {
  id: string
  name: string
  category: ShopCategory
  price: number
  patch: Partial<Cosmetics>
  swatch?: string
}

export interface LevelRecord {
  stars: number
  bestTime: number
  bestAccuracy: number
  completed: boolean
}

export interface Settings {
  sfx: number
  music: number
  muted: boolean
}

export interface SaveData {
  unlockedLevel: number
  xp: number
  wallet: number
  owned: string[]
  levels: Record<string, LevelRecord>
  settings: Settings
  cosmetics: Cosmetics
  totals: {
    time: number
    mistakes: number
    bestStreak: number
    stars: number
  }
}

export interface SaveAdapter {
  load(): SaveData | null
  save(data: SaveData): void
}

export interface RunResults {
  accuracy: number
  time: number
  mistakes: number
  bestStreak: number
  coins: number
  xp: number
  stars: number
  correct: number
}

export interface ChallengeDraft {
  type: ChallengeType
  sentence?: string
  audioText?: string
  audioKey?: string
  options: [string, string, string]
  correctAnswer: string
  hideSentence?: boolean
  length?: number
  spread?: number
  lanes?: [number, number, number]
  explanation?: string
  wrongWhy?: Record<string, string>
  timeLimit?: number
}
