import { RigidBody } from '@react-three/rapier'
import { useMemo, useState } from 'react'
import type { ChallengeDef } from '../../data/types'
import { playerRuntime } from '../../game/runtime'
import { useGameStore } from '../../store/gameStore'
import { WorldLabel } from '../WorldLabel'

export function AnswerPlatforms({ challenge }: { challenge: ChallengeDef }) {
  return (
    <group>
      {challenge.options.map((option) => (
        <AnswerBlock key={`${challenge.id}-${option.word}`} challenge={challenge} word={option.word} offset={option.offset} />
      ))}
    </group>
  )
}

function AnswerBlock({
  challenge,
  word,
  offset,
}: {
  challenge: ChallengeDef
  word: string
  offset: [number, number, number]
}) {
  const [broken, setBroken] = useState(false)
  const [locked, setLocked] = useState(false)
  const size = challenge.platformSize ?? [4.5, 0.72, 10]
  const position: [number, number, number] = [
    challenge.origin[0] + offset[0],
    challenge.origin[1],
    challenge.origin[2] + offset[2],
  ]
  const isCorrect = word === challenge.correctAnswer
  const color = locked && isCorrect ? '#3ee0b3' : broken ? '#d64545' : '#2c4c6e'
  const top = locked && isCorrect ? '#b8ffd9' : '#f4fbff'
  const sizeVec = useMemo(() => size, [size])

  return (
    <RigidBody
      type="fixed"
      position={position}
      colliders={broken ? false : 'cuboid'}
      friction={1.6}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name !== 'player') return
        if (useGameStore.getState().phase !== 'play') return
        const result = useGameStore.getState().answer(challenge.id, word, isCorrect)
        if (result === 'ignored') return
        if (result === 'correct') {
          setLocked(true)
          useGameStore.getState().spawnBurst('correct', [position[0], position[1] + 1.4, position[2]])
        } else {
          setBroken(true)
          useGameStore.getState().spawnBurst('wrong', [position[0], position[1] + 1, position[2]])
          window.setTimeout(() => {
            if (useGameStore.getState().phase === 'play') playerRuntime.respawn()
          }, 480)
        }
      }}
    >
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
