import { RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import type { CheckpointDef } from '../data/types'
import { useGameStore } from '../store/gameStore'
import { WorldLabel } from './WorldLabel'

export function CheckpointGate({ def }: { def: CheckpointDef }) {
  const used = useRef(false)
  return (
    <group position={def.position}>
      <RigidBody
        type="fixed"
        colliders="cuboid"
        sensor
        onIntersectionEnter={({ other }) => {
          if (used.current || other.rigidBodyObject?.name !== 'player') return
          used.current = true
          useGameStore.getState().setCheckpoint([def.position[0], def.position[1] + 0.8, def.position[2]])
          useGameStore.getState().spawnBurst('checkpoint', def.position)
        }}
      >
        <mesh>
          <boxGeometry args={[10, 3.2, 0.6]} />
          <meshLambertMaterial color="#3ee0b3" transparent opacity={0.18} />
        </mesh>
      </RigidBody>
      <mesh position={[-3.6, 0.2, 0]}>
        <boxGeometry args={[0.28, 3.4, 0.28]} />
        <meshLambertMaterial color="#1f6f8b" />
      </mesh>
      <mesh position={[3.6, 0.2, 0]}>
        <boxGeometry args={[0.28, 3.4, 0.28]} />
        <meshLambertMaterial color="#1f6f8b" />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[7.6, 0.28, 0.28]} />
        <meshLambertMaterial color="#ffd166" />
      </mesh>
      <WorldLabel text="CHECKPOINT" position={[0, 2.2, 0.2]} width={5.2} color="#ffd166" />
    </group>
  )
}
