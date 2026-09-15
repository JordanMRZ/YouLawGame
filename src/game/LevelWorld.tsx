import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { WorldLabel } from '../components/WorldLabel'
import type { ChallengeDef, LevelDef } from '../data/types'
import { audio } from '../audio/audioManager'
import { CheckpointGate } from '../components/Checkpoint'
import { Coin } from '../components/Coin'
import { BurstFX } from '../components/effects/Burst'
import { LevelEnvironment } from '../components/environment/LevelEnvironment'
import { GoalArch } from '../components/Goal'
import { Obstacle } from '../components/obstacles/Obstacles'
import { AnswerPlatforms } from '../components/platforms/AnswerPlatforms'
import { KillPlane, WorldPlatform } from '../components/platforms/WorldPlatform'
import { playerRuntime } from './runtime'
import { useGameStore } from '../store/gameStore'

export function LevelWorld({ level }: { level: LevelDef }) {
  return (
    <group>
      <LevelEnvironment level={level} />
      {level.platforms.map((platform) => (
        <WorldPlatform key={platform.id} def={platform} accent={level.palette.accent} />
      ))}
      {level.challenges.map((challenge) => (
        <AnswerPlatforms key={challenge.id} challenge={challenge} />
      ))}
      {level.checkpoints.map((cp) => (
        <CheckpointGate key={cp.id} def={cp} />
      ))}
      {level.obstacles.map((ob) => (
        <Obstacle key={ob.id} def={ob} />
      ))}
      {level.coins.map((coin) => (
        <Coin key={coin.id} def={coin} />
      ))}
      {level.zones?.map((zone) => (
        <WorldLabel key={zone.id} text={zone.label} position={zone.position} width={8} />
      ))}
      <GoalArch position={level.goal.position} />
      <ChallengeDirector challenges={level.challenges} />
      <ProgressLock challenges={level.challenges} />
      <TimerSync />
      <KillPlane />
      <BurstFX />
    </group>
  )
}

function ChallengeDirector({ challenges }: { challenges: ChallengeDef[] }) {
  const last = useRef<string | null>(null)
  useFrame(() => {
    const z = playerRuntime.position.z
    let current: ChallengeDef | undefined
    for (const challenge of challenges) {
      const dz = challenge.origin[2] - z
      if (dz > -7 && dz < 18) current = challenge
    }
    const id = current?.id ?? null
    if (id === last.current) return
    last.current = id
    if (!current) {
      useGameStore.getState().setPrompt(null)
      return
    }
    const hide = Boolean(current.hideSentence || current.type === 'listening')
    useGameStore.getState().setPrompt(hide ? 'Listen...' : (current.sentence ?? 'Choose a path'))
    if (current.type === 'listening' && current.audioText) {
      audio.playListening(current.audioKey, current.audioText)
    }
  })
  return null
}

function ProgressLock({ challenges }: { challenges: ChallengeDef[] }) {
  useFrame(() => {
    if (useGameStore.getState().phase !== 'play') return
    const z = playerRuntime.position.z
    const state = useGameStore.getState()
    for (const challenge of challenges) {
      if (state.answered[challenge.id] !== 'correct') continue
      const half = (challenge.platformSize?.[2] ?? 10) / 2
      const back = challenge.origin[2] - half - 1.2
      const front = challenge.origin[2] + half + 1.6
      if (z < back) {
        state.uncomplete(challenge.id)
      } else if (z > front) {
        state.setMinZ(front - 0.4)
      }
    }
  })
  return null
}

function TimerSync() {
  const acc = useRef(0)
  useFrame((_, dt) => {
    if (useGameStore.getState().phase !== 'play') return
    acc.current += dt
    if (acc.current >= 0.2) {
      useGameStore.getState().tick(acc.current)
      acc.current = 0
    }
  })
  return null
}
