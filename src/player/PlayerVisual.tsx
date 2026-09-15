import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group } from 'three'
import type { Cosmetics } from '../data/types'
import { playerRuntime } from '../game/runtime'

export function PlayerVisual({
  cosmetics,
  pose,
}: {
  cosmetics: Cosmetics
  pose?: 'idle' | 'turntable'
}) {
  const group = useRef<Group>(null)
  const leftArm = useRef<Group>(null)
  const rightArm = useRef<Group>(null)
  const leftLeg = useRef<Group>(null)
  const rightLeg = useRef<Group>(null)
  const squash = useRef(1)
  const look = useMemo(
    () => ({
      skin: cosmetics.skin,
      hair: cosmetics.hair,
      shirt: cosmetics.shirt,
      pants: cosmetics.pants,
      shoes: cosmetics.shoes,
    }),
    [cosmetics.skin, cosmetics.hair, cosmetics.shirt, cosmetics.pants, cosmetics.shoes],
  )

  useFrame((_, dt) => {
    const root = group.current
    if (!root) return
    const t = performance.now() / 1000
    const anim = pose === 'turntable' ? 'idle' : pose === 'idle' ? 'idle' : playerRuntime.anim
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

  const hoodie = cosmetics.shirtStyle === 'hoodie'
  const blazer = cosmetics.shirtStyle === 'blazer'
  const torsoW = blazer ? 0.64 : hoodie ? 0.62 : 0.58

  return (
    <group ref={group}>
      <mesh position={[0, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.29, 18, 18]} />
        <meshLambertMaterial color={look.skin} />
      </mesh>
      <mesh position={[-0.22, 1.42, 0.02]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshLambertMaterial color={look.skin} />
      </mesh>
      <mesh position={[0.22, 1.42, 0.02]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshLambertMaterial color={look.skin} />
      </mesh>
      <mesh position={[-0.09, 1.46, 0.24]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshLambertMaterial color="#1b2430" />
      </mesh>
      <mesh position={[0.09, 1.46, 0.24]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshLambertMaterial color="#1b2430" />
      </mesh>
      <mesh position={[0, 1.32, 0.26]}>
        <boxGeometry args={[0.1, 0.03, 0.04]} />
        <meshLambertMaterial color="#c47a6a" />
      </mesh>
      <Hair cosmetics={cosmetics} />
      <Glasses cosmetics={cosmetics} />
      <Hat cosmetics={cosmetics} />

      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[torsoW, 0.64, hoodie ? 0.4 : 0.36]} />
        <meshLambertMaterial color={look.shirt} />
      </mesh>
      {hoodie && (
        <>
          <mesh position={[0, 1.22, -0.08]} castShadow>
            <sphereGeometry args={[0.22, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshLambertMaterial color={look.shirt} />
          </mesh>
          <mesh position={[0, 0.82, 0.16]}>
            <boxGeometry args={[0.34, 0.16, 0.12]} />
            <meshLambertMaterial color={look.shirt} />
          </mesh>
        </>
      )}
      {blazer && (
        <>
          <mesh position={[-0.12, 1.12, 0.19]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[0.16, 0.28, 0.04]} />
            <meshLambertMaterial color="#f2f4f8" />
          </mesh>
          <mesh position={[0.12, 1.12, 0.19]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[0.16, 0.28, 0.04]} />
            <meshLambertMaterial color="#f2f4f8" />
          </mesh>
        </>
      )}
      {!hoodie && !blazer && (
        <mesh position={[0, 1.18, 0.02]}>
          <boxGeometry args={[0.4, 0.08, 0.38]} />
          <meshLambertMaterial color="#f2f4f8" />
        </mesh>
      )}
      {cosmetics.scarf && (
        <mesh position={[0, 1.24, 0.04]} castShadow>
          <torusGeometry args={[0.2, 0.05, 8, 16]} />
          <meshLambertMaterial color="#d64545" />
        </mesh>
      )}

      <group ref={leftArm} position={[-(torsoW * 0.68), 1.12, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.17, 0.56, 0.17]} />
          <meshLambertMaterial color={look.shirt} />
        </mesh>
        <mesh position={[0, -0.54, 0]}>
          <boxGeometry args={[0.15, 0.12, 0.15]} />
          <meshLambertMaterial color={look.skin} />
        </mesh>
        {cosmetics.watch && (
          <mesh position={[0, -0.42, 0]}>
            <boxGeometry args={[0.18, 0.05, 0.18]} />
            <meshLambertMaterial color="#ffd166" />
          </mesh>
        )}
      </group>
      <group ref={rightArm} position={[torsoW * 0.68, 1.12, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.17, 0.56, 0.17]} />
          <meshLambertMaterial color={look.shirt} />
        </mesh>
        <mesh position={[0, -0.54, 0]}>
          <boxGeometry args={[0.15, 0.12, 0.15]} />
          <meshLambertMaterial color={look.skin} />
        </mesh>
      </group>
      <group ref={leftLeg} position={[-0.16, 0.58, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.21, 0.5, 0.23]} />
          <meshLambertMaterial color={look.pants} />
        </mesh>
        <mesh position={[0, -0.54, 0.05]} castShadow>
          <boxGeometry args={[0.23, 0.11, 0.32]} />
          <meshLambertMaterial color={look.shoes} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.16, 0.58, 0]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <boxGeometry args={[0.21, 0.5, 0.23]} />
          <meshLambertMaterial color={look.pants} />
        </mesh>
        <mesh position={[0, -0.54, 0.05]} castShadow>
          <boxGeometry args={[0.23, 0.11, 0.32]} />
          <meshLambertMaterial color={look.shoes} />
        </mesh>
      </group>
      <Backpack cosmetics={cosmetics} />
    </group>
  )
}

function Hair({ cosmetics }: { cosmetics: Cosmetics }) {
  const color = cosmetics.hair
  if (cosmetics.hairStyle === 'spike') {
    return (
      <group position={[0, 1.62, 0]}>
        {[-0.12, 0, 0.12].map((x) => (
          <mesh key={x} position={[x, 0.08, -0.02]} rotation={[0.15, 0, x * 0.8]} castShadow>
            <coneGeometry args={[0.1, 0.28, 6]} />
            <meshLambertMaterial color={color} />
          </mesh>
        ))}
      </group>
    )
  }
  if (cosmetics.hairStyle === 'bun') {
    return (
      <group>
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.3, 14, 12]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.78, -0.12]} castShadow>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshLambertMaterial color={color} />
        </mesh>
      </group>
    )
  }
  if (cosmetics.hairStyle === 'long') {
    return (
      <group>
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.31, 14, 12]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.28, -0.16]} castShadow>
          <boxGeometry args={[0.38, 0.5, 0.16]} />
          <meshLambertMaterial color={color} />
        </mesh>
      </group>
    )
  }
  return (
    <mesh position={[0, 1.6, 0]} castShadow>
      <sphereGeometry args={[0.3, 16, 12]} />
      <meshLambertMaterial color={color} />
    </mesh>
  )
}

function Glasses({ cosmetics }: { cosmetics: Cosmetics }) {
  if (cosmetics.glasses === 'none') return null
  const sun = cosmetics.glasses === 'sun'
  const round = cosmetics.glasses === 'round'
  const lens = sun ? '#1b1b1b' : '#1b2430'
  return (
    <group position={[0, 1.44, 0.22]}>
      {round ? (
        <>
          <mesh position={[-0.1, 0, 0]}>
            <torusGeometry args={[0.07, 0.018, 8, 12]} />
            <meshLambertMaterial color={lens} />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
            <torusGeometry args={[0.07, 0.018, 8, 12]} />
            <meshLambertMaterial color={lens} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[-0.11, 0, 0]}>
            <boxGeometry args={[0.15, 0.09, sun ? 0.05 : 0.04]} />
            <meshLambertMaterial color={lens} />
          </mesh>
          <mesh position={[0.11, 0, 0]}>
            <boxGeometry args={[0.15, 0.09, sun ? 0.05 : 0.04]} />
            <meshLambertMaterial color={lens} />
          </mesh>
        </>
      )}
      <mesh>
        <boxGeometry args={[0.08, 0.02, 0.03]} />
        <meshLambertMaterial color={lens} />
      </mesh>
    </group>
  )
}

function Hat({ cosmetics }: { cosmetics: Cosmetics }) {
  if (cosmetics.hat === 'none') return null
  if (cosmetics.hat === 'cap') {
    return (
      <group position={[0, 1.72, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.24, 0.26, 0.12, 12]} />
          <meshLambertMaterial color={cosmetics.shirt} />
        </mesh>
        <mesh position={[0, -0.02, 0.18]}>
          <boxGeometry args={[0.28, 0.04, 0.18]} />
          <meshLambertMaterial color={cosmetics.shirt} />
        </mesh>
      </group>
    )
  }
  if (cosmetics.hat === 'beanie') {
    return (
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshLambertMaterial color="#3ee0b3" />
      </mesh>
    )
  }
  return (
    <mesh position={[0, 1.78, 0.02]} rotation={[0, 0, 0.4]} castShadow>
      <torusGeometry args={[0.12, 0.04, 8, 12]} />
      <meshLambertMaterial color="#ff6b9d" />
    </mesh>
  )
}

function Backpack({ cosmetics }: { cosmetics: Cosmetics }) {
  if (cosmetics.backpack === 'none') return null
  if (cosmetics.backpack === 'satchel') {
    return (
      <mesh position={[0.28, 0.88, 0.02]} rotation={[0, 0, -0.35]} castShadow>
        <boxGeometry args={[0.22, 0.28, 0.16]} />
        <meshLambertMaterial color="#8d6e4c" />
      </mesh>
    )
  }
  return (
    <group position={[0, 0.98, -0.28]}>
      <mesh castShadow>
        <boxGeometry args={[0.42, 0.48, 0.2]} />
        <meshLambertMaterial color="#2e4a62" />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.36, 0.1, 0.22]} />
        <meshLambertMaterial color="#ffd166" />
      </mesh>
    </group>
  )
}
