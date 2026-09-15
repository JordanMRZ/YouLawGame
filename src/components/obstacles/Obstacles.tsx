import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RapierRigidBody } from '@react-three/rapier'
import { Euler, Quaternion } from 'three'
import type { ObstacleDef } from '../../data/types'
import { playerRuntime } from '../../game/runtime'

const quat = new Quaternion()
const euler = new Euler()

export function Obstacle({ def }: { def: ObstacleDef }) {
  if (def.kind === 'barrier') return <Barrier def={def} />
  if (def.kind === 'hammer') return <Hammer def={def} />
  if (def.kind === 'fan') return <Fan def={def} />
  if (def.kind === 'spinner') return <Spinner def={def} />
  return <MovingBlock def={def} />
}

function Barrier({ def }: { def: ObstacleDef }) {
  const size = def.size ?? [2.2, 1, 0.7]
  return (
    <RigidBody type="fixed" position={def.position} colliders="cuboid" friction={0.35}>
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshLambertMaterial color={def.color ?? '#d64545'} />
      </mesh>
      <mesh position={[0, size[1] * 0.52, 0]}>
        <boxGeometry args={[size[0], 0.08, size[2] + 0.08]} />
        <meshLambertMaterial color="#ffd166" />
      </mesh>
    </RigidBody>
  )
}

function Hammer({ def }: { def: ObstacleDef }) {
  const ref = useRef<RapierRigidBody>(null)
  const speed = def.speed ?? 1.1
  useFrame((state) => {
    euler.set(Math.sin(state.clock.elapsedTime * speed) * 1.25, 0, 0)
    quat.setFromEuler(euler)
    ref.current?.setNextKinematicRotation(quat)
  })
  return (
    <RigidBody
      ref={ref}
      type="kinematicPosition"
      position={def.position}
      colliders={false}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name !== 'player') return
        playerRuntime.applyImpulse((Math.random() - 0.5) * 4, 2.2, -2)
      }}
    >
      <CuboidCollider args={[0.28, 1.7, 0.28]} position={[0, -0.5, 0]} />
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshLambertMaterial color="#6c584c" />
      </mesh>
      <mesh position={[0, -1.15, 0]} castShadow>
        <boxGeometry args={[1.4, 0.7, 0.7]} />
        <meshLambertMaterial color="#bc4749" />
      </mesh>
    </RigidBody>
  )
}

function Fan({ def }: { def: ObstacleDef }) {
  const blades = useRef<RapierRigidBody>(null)
  const speed = def.speed ?? 1
  useFrame((state) => {
    euler.set(0, 0, state.clock.elapsedTime * speed * 6)
    quat.setFromEuler(euler)
    blades.current?.setNextKinematicRotation(quat)
    const p = playerRuntime.position
    const dx = p.x - def.position[0]
    const dz = p.z - def.position[2]
    if (Math.hypot(dx, dz) < 3.4 && Math.abs(p.y - def.position[1]) < 2.2) {
      playerRuntime.applyImpulse(0.18 * speed, 0.02, 0)
    }
  })
  return (
    <RigidBody ref={blades} type="kinematicPosition" position={def.position} colliders={false} sensor>
      <CuboidCollider args={[1.3, 0.08, 0.22]} />
      <mesh>
        <boxGeometry args={[2.6, 0.12, 0.36]} />
        <meshLambertMaterial color="#4cc9f0" />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[2.6, 0.12, 0.36]} />
        <meshLambertMaterial color="#90e0ef" />
      </mesh>
    </RigidBody>
  )
}

function Spinner({ def }: { def: ObstacleDef }) {
  const ref = useRef<RapierRigidBody>(null)
  const speed = def.speed ?? 1.4
  useFrame((state) => {
    euler.set(0, state.clock.elapsedTime * speed, 0)
    quat.setFromEuler(euler)
    ref.current?.setNextKinematicRotation(quat)
  })
  return (
    <RigidBody
      ref={ref}
      type="kinematicPosition"
      position={def.position}
      colliders={false}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name !== 'player') return
        playerRuntime.applyImpulse(3.5, 1.5, 0)
      }}
    >
      <CuboidCollider args={[2.2, 0.18, 0.22]} />
      <mesh castShadow>
        <boxGeometry args={[4.4, 0.28, 0.36]} />
        <meshLambertMaterial color="#e76f51" />
      </mesh>
    </RigidBody>
  )
}

function MovingBlock({ def }: { def: ObstacleDef }) {
  const ref = useRef<RapierRigidBody>(null)
  const speed = def.speed ?? 1.2
  const size = def.size ?? [1.6, 1.6, 1.6]
  useFrame((state) => {
    const x = def.position[0] + Math.sin(state.clock.elapsedTime * speed) * 3.2
    ref.current?.setNextKinematicTranslation({ x, y: def.position[1], z: def.position[2] })
  })
  return (
    <RigidBody ref={ref} type="kinematicPosition" position={def.position} colliders="cuboid">
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshLambertMaterial color="#bc6c25" />
      </mesh>
    </RigidBody>
  )
}
