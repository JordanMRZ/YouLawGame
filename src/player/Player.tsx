import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { RapierRigidBody } from '@react-three/rapier'
import { Group } from 'three'
import { audio } from '../audio/audioManager'
import type { LevelDef } from '../data/types'
import { playerRuntime } from '../game/runtime'
import { useGameStore } from '../store/gameStore'
import { PlayerVisual } from './PlayerVisual'
import { useKeyboard } from './useKeyboard'

const MOVE_SPEED = 10.2
const SPRINT_SPEED = 14.2
const AIR_CONTROL = 0.72
const JUMP_VEL = 9.4

export function Player({ level }: { level: LevelDef }) {
  const bodyRef = useRef<RapierRigidBody>(null)
  const visualRef = useRef<Group>(null)
  const keys = useKeyboard()
  const { world, rapier } = useRapier()
  const coyote = useRef(0)
  const jumpBuffer = useRef(0)
  const sprintUntil = useRef(0)
  const sprintReady = useRef(0)
  const wasGrounded = useRef(false)
  const landUntil = useRef(0)
  const cosmetics = useGameStore((s) => s.save.cosmetics)

  useEffect(() => {
    playerRuntime.respawn = () => {
      const body = bodyRef.current
      if (!body) return
      const cp = useGameStore.getState().lastCheckpoint
      body.setTranslation({ x: cp[0], y: cp[1], z: cp[2] }, true)
      body.setLinvel({ x: 0, y: 0, z: 0 }, true)
      playerRuntime.invulnerableUntil = performance.now() + 2200
      playerRuntime.yaw = 0
    }
    playerRuntime.applyImpulse = (x, y, z) => {
      bodyRef.current?.applyImpulse({ x, y, z }, true)
    }
    playerRuntime.bounce = (strength) => {
      const body = bodyRef.current
      if (!body) return
      const v = body.linvel()
      body.setLinvel({ x: v.x, y: strength, z: v.z }, true)
    }
    return () => {
      playerRuntime.ready = false
    }
  }, [])

  useFrame((_, dt) => {
    const body = bodyRef.current
    if (!body) return
    const phase = useGameStore.getState().phase
    const origin = body.translation()
    const vel = body.linvel()
    playerRuntime.position.set(origin.x, origin.y, origin.z)
    playerRuntime.velocity.set(vel.x, vel.y, vel.z)
    playerRuntime.ready = true

    if (visualRef.current) visualRef.current.rotation.y = playerRuntime.yaw

    if (phase === 'results' || phase === 'credits') {
      playerRuntime.anim = 'victory'
      body.setLinvel({ x: 0, y: vel.y, z: 0 }, true)
      return
    }
    if (phase !== 'play') {
      playerRuntime.anim = 'idle'
      body.setLinvel({ x: 0, y: 0, z: 0 }, true)
      return
    }

    const ray = new rapier.Ray({ x: origin.x, y: origin.y + 0.35, z: origin.z }, { x: 0, y: -1, z: 0 })
    const hit = world.castRay(ray, 0.55, false, undefined, undefined, undefined, body, (collider) => !collider.isSensor())
    const grounded = hit !== null && hit.timeOfImpact < 0.5
    playerRuntime.grounded = grounded
    playerRuntime.platformVelocity.set(0, 0, 0)
    if (hit) {
      const parent = hit.collider.parent()
      if (parent?.isKinematic()) {
        const lv = parent.linvel()
        playerRuntime.platformVelocity.set(lv.x, 0, lv.z)
      }
    }

    if (grounded) coyote.current = 0.12
    else coyote.current = Math.max(0, coyote.current - dt)

    const k = keys.current
    if (k.has('Space')) jumpBuffer.current = 0.12
    else jumpBuffer.current = Math.max(0, jumpBuffer.current - dt)

    const nowMs = performance.now()
    const stunned = nowMs < playerRuntime.invulnerableUntil
    const now = nowMs / 1000
    if ((k.has('ShiftLeft') || k.has('ShiftRight')) && grounded && now > sprintReady.current && !stunned) {
      sprintUntil.current = now + 1.15
      sprintReady.current = now + 3.1
    }
    const sprinting = now < sprintUntil.current
    const speed = sprinting ? SPRINT_SPEED : MOVE_SPEED

    let ix = 0
    let iz = 0
    if (!stunned) {
      if (k.has('KeyW') || k.has('ArrowUp')) iz += 1
      if (k.has('KeyS') || k.has('ArrowDown')) iz -= 0.4
      if (k.has('KeyA') || k.has('ArrowLeft')) ix += 1
      if (k.has('KeyD') || k.has('ArrowRight')) ix -= 1
      if (level.autoRun) iz = Math.max(iz, 1)
    }

    const len = Math.hypot(ix, iz)
    if (len > 1) {
      ix /= len
      iz /= len
    }

    const control = grounded ? 1 : AIR_CONTROL
    const targetX = ix * speed * control + playerRuntime.platformVelocity.x
    const targetZ = iz * speed * control + playerRuntime.platformVelocity.z
    const nextX = vel.x + (targetX - vel.x) * Math.min(1, dt * 12)
    const nextZ = vel.z + (targetZ - vel.z) * Math.min(1, dt * 12)
    let nextY = vel.y

    if (!stunned && jumpBuffer.current > 0 && coyote.current > 0) {
      nextY = JUMP_VEL
      coyote.current = 0
      jumpBuffer.current = 0
      audio.play('jump')
      playerRuntime.anim = 'jump'
    }

    body.setLinvel({ x: nextX, y: nextY, z: nextZ }, true)

    const face = Math.atan2(ix * 0.45, 1)
    playerRuntime.yaw += (face - playerRuntime.yaw) * Math.min(1, dt * 8)

    if (!grounded && vel.y < -1.2) playerRuntime.anim = 'fall'
    else if (!grounded && vel.y > 0.8) playerRuntime.anim = 'jump'
    else if (grounded && !wasGrounded.current) {
      landUntil.current = now + 0.16
      audio.play('land')
      playerRuntime.anim = 'land'
    } else if (now < landUntil.current) playerRuntime.anim = 'land'
    else if (grounded && (Math.hypot(nextX, nextZ) > 1.4 || level.autoRun)) playerRuntime.anim = 'run'
    else playerRuntime.anim = 'idle'

    wasGrounded.current = grounded
  })

  return (
    <RigidBody
      ref={bodyRef}
      name="player"
      position={level.start}
      colliders={false}
      lockRotations
      friction={0}
      restitution={0}
      linearDamping={0.08}
      ccd
      canSleep={false}
      userData={{ player: true }}
    >
      <CapsuleCollider args={[0.46, 0.36]} position={[0, 0.82, 0]} />
      <group ref={visualRef}>
        <PlayerVisual cosmetics={cosmetics} />
      </group>
    </RigidBody>
  )
}
