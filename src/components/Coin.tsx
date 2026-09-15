import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Group } from 'three'
import type { CoinDef } from '../data/types'
import { useGameStore } from '../store/gameStore'

export function Coin({ def }: { def: CoinDef }) {
  const [taken, setTaken] = useState(false)
  const spin = useRef<Group>(null)
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 2.4
  })
  if (taken) return null
  return (
    <RigidBody
      type="fixed"
      position={def.position}
      sensor
      colliders="ball"
      onIntersectionEnter={({ other }) => {
        if (other.rigidBodyObject?.name !== 'player') return
        setTaken(true)
        useGameStore.getState().collectCoin(def.id)
        useGameStore.getState().spawnBurst('coin', def.position)
      }}
    >
      <group ref={spin}>
        <mesh castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.08, 16]} />
          <meshLambertMaterial color="#ffd166" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
          <torusGeometry args={[0.18, 0.04, 8, 12]} />
          <meshLambertMaterial color="#f4a261" />
        </mesh>
      </group>
    </RigidBody>
  )
}
