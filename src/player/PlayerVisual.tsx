import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group } from 'three'
import type { Cosmetics } from '../data/types'
import { playerRuntime } from '../game/runtime'

const SKIN = '#f0c7a0'
const HAIR = '#3a2a22'
const PANTS = '#243447'
const SHOE = '#1b1b1b'

export function PlayerVisual({ cosmetics }: { cosmetics: Cosmetics }) {
  const group = useRef<Group>(null)
  const leftArm = useRef<Group>(null)
  const rightArm = useRef<Group>(null)
  const leftLeg = useRef<Group>(null)
  const rightLeg = useRef<Group>(null)
  const squash = useRef(1)
  const materials = useMemo(
    () => ({
      shirt: cosmetics.shirt,
      skin: SKIN,
      hair: HAIR,
      pants: PANTS,
    }),
    [cosmetics.shirt],
  )

  useFrame((_, dt) => {
    const root = group.current
    if (!root) return
    const t = performance.now() / 1000
    const anim = playerRuntime.anim
    const speed = Math.min(1, playerRuntime.velocity.length() / 9)
    let arm = 0
    let leg = 0
    let bob = 0
    let armZ = 0

    if (anim === 'run') {
      const swing = Math.sin(t * 11) * 0.7 * speed
      arm = swing
      leg = -swing
      bob = Math.abs(Math.sin(t * 11)) * 0.06
    } else if (anim === 'idle') {
      bob = Math.sin(t * 2.2) * 0.025
      arm = Math.sin(t * 1.6) * 0.08
    } else if (anim === 'jump') {
      arm = -0.55
      armZ = 0.25
      leg = -0.35
    } else if (anim === 'fall') {
      arm = -0.9
      armZ = 0.55
      leg = 0.25
    } else if (anim === 'land') {
      squash.current = 0.82
      arm = 0.35
    } else if (anim === 'victory') {
      arm = -2.3
      bob = Math.abs(Math.sin(t * 6)) * 0.12
    }

    squash.current += (1 - squash.current) * Math.min(1, dt * 10)
    root.position.y = bob
    root.scale.set(1, squash.current, 1)
    if (leftArm.current) leftArm.current.rotation.set(arm, 0, 0.18 + armZ)
    if (rightArm.current) rightArm.current.rotation.set(-arm, 0, -0.18 - armZ)
    if (leftLeg.current) leftLeg.current.rotation.x = leg * 0.9
    if (rightLeg.current) rightLeg.current.rotation.x = -leg * 0.9
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh position={[0, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshLambertMaterial color={materials.skin} />
      </mesh>
      <mesh position={[0, 1.58, 0]} castShadow>
        <sphereGeometry args={[0.29, 16, 12]} />
        <meshLambertMaterial color={materials.hair} />
      </mesh>
      {cosmetics.glasses && (
        <group position={[0, 1.43, 0.18]}>
          <mesh position={[-0.11, 0, 0]}>
            <boxGeometry args={[0.14, 0.08, 0.04]} />
            <meshLambertMaterial color="#1b2430" />
          </mesh>
          <mesh position={[0.11, 0, 0]}>
            <boxGeometry args={[0.14, 0.08, 0.04]} />
            <meshLambertMaterial color="#1b2430" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.02, 0.03]} />
            <meshLambertMaterial color="#1b2430" />
          </mesh>
        </group>
      )}
      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[0.58, 0.62, 0.36]} />
        <meshLambertMaterial color={materials.shirt} />
      </mesh>
      <mesh position={[0, 1.18, 0.02]}>
        <boxGeometry args={[0.4, 0.08, 0.38]} />
        <meshLambertMaterial color="#f2f4f8" />
      </mesh>
      <group ref={leftArm} position={[-0.4, 1.12, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.16, 0.56, 0.16]} />
          <meshLambertMaterial color={materials.shirt} />
        </mesh>
        <mesh position={[0, -0.54, 0]}>
          <boxGeometry args={[0.14, 0.12, 0.14]} />
          <meshLambertMaterial color={materials.skin} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.4, 1.12, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.16, 0.56, 0.16]} />
          <meshLambertMaterial color={materials.shirt} />
        </mesh>
        <mesh position={[0, -0.54, 0]}>
          <boxGeometry args={[0.14, 0.12, 0.14]} />
          <meshLambertMaterial color={materials.skin} />
        </mesh>
      </group>
      <group ref={leftLeg} position={[-0.16, 0.58, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.2, 0.5, 0.22]} />
          <meshLambertMaterial color={materials.pants} />
        </mesh>
        <mesh position={[0, -0.54, 0.04]}>
          <boxGeometry args={[0.22, 0.1, 0.3]} />
          <meshLambertMaterial color={SHOE} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.16, 0.58, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.2, 0.5, 0.22]} />
          <meshLambertMaterial color={materials.pants} />
        </mesh>
        <mesh position={[0, -0.54, 0.04]}>
          <boxGeometry args={[0.22, 0.1, 0.3]} />
          <meshLambertMaterial color={SHOE} />
        </mesh>
      </group>
      {cosmetics.backpack && (
        <mesh position={[0, 0.98, -0.26]} castShadow>
          <boxGeometry args={[0.42, 0.46, 0.18]} />
          <meshLambertMaterial color="#2e4a62" />
        </mesh>
      )}
    </group>
  )
}
