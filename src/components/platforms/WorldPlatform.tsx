import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import type { RapierRigidBody } from '@react-three/rapier'
import { Euler, Quaternion } from 'three'
import type { PlatformDef } from '../../data/types'
import { playerRuntime } from '../../game/runtime'
import { useGameStore } from '../../store/gameStore'

const quat = new Quaternion()
const euler = new Euler()

export function WorldPlatform({ def, accent }: { def: PlatformDef; accent: string }) {
  const kind = def.kind ?? 'static'
  const color = def.color ?? accent
  const [w, h, d] = def.size
  const [vanished, setVanished] = useState(false)
  const touching = useRef(false)
  const vanishAt = useRef(0)
  const body = useRef<RapierRigidBody>(null)
  const origin = useMemo(() => ({ x: def.position[0], y: def.position[1], z: def.position[2] }), [def.position])

  useFrame((state) => {
    const rb = body.current
    if (!rb) return
    const t = state.clock.elapsedTime
    if (kind === 'moving' && def.motion) {
      const { axis, amplitude, speed, phase = 0 } = def.motion
      const off = Math.sin(t * speed + phase) * amplitude
      rb.setNextKinematicTranslation({
        x: origin.x + (axis === 'x' ? off : 0),
        y: origin.y + (axis === 'y' ? off : 0),
        z: origin.z + (axis === 'z' ? off : 0),
      })
    }
    if (kind === 'rotating') {
      euler.set(0, t * (def.rotationSpeed ?? 0.8), 0)
      quat.setFromEuler(euler)
      rb.setNextKinematicRotation(quat)
    }
    if (kind === 'vanishing' && touching.current && !vanished && vanishAt.current > 0 && performance.now() > vanishAt.current) {
      setVanished(true)
      window.setTimeout(() => {
        touching.current = false
        setVanished(false)
      }, 2600)
    }
  })

  if (vanished) return null

  const type = kind === 'moving' || kind === 'rotating' ? 'kinematicPosition' : 'fixed'
  const isRecovery = kind === 'recovery'

  return (
    <RigidBody
      ref={body}
      type={type}
      position={def.position}
      colliders="cuboid"
      friction={isRecovery ? 0.2 : 1.4}
      restitution={kind === 'bounce' ? 1.35 : 0}
      sensor={isRecovery}
      onIntersectionEnter={({ other }) => {
        if (!isRecovery || other.rigidBodyObject?.name !== 'player') return
        playerRuntime.respawn()
      }}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name !== 'player') return
        if (kind === 'bounce') playerRuntime.bounce(13.5)
        if (kind === 'vanishing' && !touching.current) {
          touching.current = true
          vanishAt.current = performance.now() + 850
        }
      }}
      onCollisionExit={({ other }) => {
        if (other.rigidBodyObject?.name !== 'player') return
        if (kind === 'vanishing') touching.current = false
      }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshLambertMaterial color={isRecovery ? '#7ec8e3' : color} transparent={isRecovery} opacity={isRecovery ? 0.55 : 1} />
      </mesh>
      {!isRecovery && (
        <mesh position={[0, h * 0.52, 0]} receiveShadow>
          <boxGeometry args={[w * 0.96, 0.06, d * 0.96]} />
          <meshLambertMaterial color="#ffffff" />
        </mesh>
      )}
    </RigidBody>
  )
}

export function KillPlane() {
  const cooled = useRef(0)
  useFrame(() => {
    if (playerRuntime.position.y < -8 && performance.now() > cooled.current) {
      cooled.current = performance.now() + 900
      const phase = useGameStore.getState().phase
      if (phase !== 'play') return
      if (performance.now() < playerRuntime.invulnerableUntil) {
        playerRuntime.respawn()
        return
      }
      const alive = useGameStore.getState().loseLife('fall')
      if (alive) playerRuntime.respawn()
    }
  })
  return null
}
