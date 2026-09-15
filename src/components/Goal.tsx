import { Sparkles } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import type { Vec3 } from '../data/types'
import { playerRuntime } from '../game/runtime'
import { useGameStore } from '../store/gameStore'
import { WorldLabel } from './WorldLabel'

export function GoalArch({ position }: { position: Vec3 }) {
  const used = useRef(false)
  return (
    <group position={position}>
      <RigidBody
        type="fixed"
        sensor
        colliders="cuboid"
        onIntersectionEnter={({ other }) => {
          if (used.current || other.rigidBodyObject?.name !== 'player') return
          used.current = true
          playerRuntime.anim = 'victory'
          useGameStore.getState().spawnBurst('goal', position)
          useGameStore.getState().finishLevel()
        }}
      >
        <mesh>
          <boxGeometry args={[8, 4.2, 1.2]} />
          <meshLambertMaterial color="#ffd166" transparent opacity={0.16} />
        </mesh>
      </RigidBody>
      <mesh position={[-3.8, 0.4, 0]} castShadow>
        <boxGeometry args={[0.5, 4.4, 0.5]} />
        <meshLambertMaterial color="#f4a261" />
      </mesh>
      <mesh position={[3.8, 0.4, 0]} castShadow>
        <boxGeometry args={[0.5, 4.4, 0.5]} />
        <meshLambertMaterial color="#f4a261" />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[8.2, 0.7, 0.6]} />
        <meshLambertMaterial color="#e76f51" />
      </mesh>
      <WorldLabel text="GOAL" position={[0, 2.6, 0.45]} width={4.4} color="#fff7e6" />
      <Sparkles count={18} scale={[6, 3, 2]} size={4} speed={0.4} color="#ffd166" />
    </group>
  )
}
