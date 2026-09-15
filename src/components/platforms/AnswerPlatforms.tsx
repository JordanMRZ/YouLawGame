import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { ChallengeDef } from '../../data/types'
import { playerRuntime } from '../../game/runtime'
import { useGameStore } from '../../store/gameStore'
import { WorldLabel } from '../WorldLabel'

export function AnswerPlatforms({ challenge }: { challenge: ChallengeDef }) {
  const tried = useGameStore((s) => s.tried[challenge.id] ?? emptyTried)
  const resolved = useGameStore((s) => s.answered[challenge.id])
  const dwell = useRef<Record<string, number>>({})
  const entered = useRef(false)

  useFrame((_, dt) => {
    const state = useGameStore.getState()
    if (state.phase !== 'play' || state.mistake) return
    if (state.answered[challenge.id] === 'correct') return
    if (!playerRuntime.ready) return
    if (performance.now() < playerRuntime.invulnerableUntil) return

    const p = playerRuntime.position
    const size = challenge.platformSize ?? [4.5, 0.72, 10]
    const halfZ = size[2] / 2
    const front = challenge.origin[2] + halfZ
    const back = challenge.origin[2] - halfZ
    const triedNow = state.tried[challenge.id] ?? emptyTried

    let standingOnAny = false
    for (const option of challenge.options) {
      if (triedNow.includes(option.word)) {
        dwell.current[option.word] = 0
        continue
      }
      const platX = challenge.origin[0] + option.offset[0]
      const platY = challenge.origin[1]
      const platZ = challenge.origin[2] + option.offset[2]
      if (isStandingOnPad(p.x, p.y, p.z, platX, platY, platZ, size)) {
        standingOnAny = true
        dwell.current[option.word] = (dwell.current[option.word] ?? 0) + dt
        if (dwell.current[option.word] >= 0.12) {
          dwell.current[option.word] = 0
          state.answer(challenge.id, option.word, option.word === challenge.correctAnswer)
          return
        }
      } else {
        dwell.current[option.word] = 0
      }
    }

    const inApproach = p.z >= back - 0.8 && p.z <= front + 0.4
    if (inApproach) entered.current = true
    if (p.z < back - 2) entered.current = false

    if (entered.current && p.z > front + 1.1 && p.y > challenge.origin[1] - 1.2 && !standingOnAny) {
      entered.current = false
      state.missChallenge(challenge.id, 'passed')
    }
  })

  return (
    <group>
      {challenge.options.map((option) => (
        <AnswerBlock
          key={`${challenge.id}-${option.word}`}
          challenge={challenge}
          word={option.word}
          offset={option.offset}
          broken={tried.includes(option.word) && option.word !== challenge.correctAnswer}
          locked={resolved === 'correct' && option.word === challenge.correctAnswer}
        />
      ))}
    </group>
  )
}

const emptyTried: string[] = []

function isStandingOnPad(
  px: number,
  py: number,
  pz: number,
  platX: number,
  platY: number,
  platZ: number,
  size: [number, number, number],
) {
  if (!playerRuntime.grounded) return false
  const top = platY + size[1] / 2
  if (py < top - 0.12 || py > top + 0.7) return false
  if (Math.abs(px - platX) > size[0] * 0.42) return false
  if (Math.abs(pz - platZ) > size[2] * 0.42) return false
  return true
}

function AnswerBlock({
  challenge,
  word,
  offset,
  broken,
  locked,
}: {
  challenge: ChallengeDef
  word: string
  offset: [number, number, number]
  broken: boolean
  locked: boolean
}) {
  const size = challenge.platformSize ?? [4.5, 0.72, 10]
  const position: [number, number, number] = [
    challenge.origin[0] + offset[0],
    challenge.origin[1],
    challenge.origin[2] + offset[2],
  ]
  const color = locked ? '#3ee0b3' : broken ? '#d64545' : '#2c4c6e'
  const top = locked ? '#b8ffd9' : '#f4fbff'
  const sizeVec = useMemo(() => size, [size])

  return (
    <RigidBody type="fixed" position={position} colliders={broken ? false : 'cuboid'} friction={1.6}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={sizeVec} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0, size[1] * 0.52, 0]} receiveShadow>
        <boxGeometry args={[size[0] * 0.96, 0.07, size[2] * 0.96]} />
        <meshLambertMaterial color={top} />
      </mesh>
      <WorldLabel text={word} position={[0, size[1] * 0.5 + 1.05, 0]} width={word.length > 10 ? 5.6 : 4.2} />
    </RigidBody>
  )
}
