import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group } from 'three'
import type { Cosmetics } from '../data/types'
import { playerRuntime } from '../game/runtime'

function Skin({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.48}
      metalness={0.02}
      sheen={0.35}
      sheenRoughness={0.72}
      sheenColor="#fff1e4"
    />
  )
}

function Cloth({ color, shiny = false }: { color: string; shiny?: boolean }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={shiny ? 0.22 : 0.62}
      metalness={shiny ? 0.42 : 0.04}
      sheen={shiny ? 0.15 : 0.45}
      sheenRoughness={0.7}
      sheenColor="#ffffff"
    />
  )
}

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
    const anim = pose === 'turntable' || pose === 'idle' ? 'idle' : playerRuntime.anim
    const speed = Math.min(1, playerRuntime.velocity.length() / 9)
    let arm = 0
    let leg = 0
    let bob = 0
    let armZ = 0

    if (anim === 'run') {
      const swing = Math.sin(t * 11) * 0.72 * speed
      arm = swing
      leg = -swing
      bob = Math.abs(Math.sin(t * 11)) * 0.05
    } else if (anim === 'idle') {
      bob = Math.sin(t * 2.1) * 0.018
      arm = Math.sin(t * 1.45) * 0.06
    } else if (anim === 'jump') {
      arm = -0.55
      armZ = 0.22
      leg = -0.32
    } else if (anim === 'fall') {
      arm = -0.85
      armZ = 0.5
      leg = 0.22
    } else if (anim === 'land') {
      squash.current = 0.84
      arm = 0.32
    } else if (anim === 'victory') {
      arm = -2.25
      bob = Math.abs(Math.sin(t * 6)) * 0.1
    }

    squash.current += (1 - squash.current) * Math.min(1, dt * 10)
    root.position.y = bob
    root.scale.set(1, squash.current, 1)
    if (leftArm.current) leftArm.current.rotation.set(arm * 0.55, 0, -0.4 - armZ)
    if (rightArm.current) rightArm.current.rotation.set(-arm * 0.55, 0, 0.4 + armZ)
    if (leftLeg.current) leftLeg.current.rotation.x = leg * 0.88
    if (rightLeg.current) rightLeg.current.rotation.x = -leg * 0.88
  })

  const hoodie = cosmetics.shirtStyle === 'hoodie'
  const blazer = cosmetics.shirtStyle === 'blazer'
  const torsoR = blazer ? 0.23 : hoodie ? 0.22 : 0.2

  return (
    <group ref={group}>
      <group position={[0, 1.5, 0]} scale={[1, 0.96, 0.94]}>
        <mesh castShadow>
          <sphereGeometry args={[0.36, 32, 28]} />
          <Skin color={look.skin} />
        </mesh>
        <mesh position={[-0.22, -0.04, 0.16]} scale={[1, 0.85, 0.8]}>
          <sphereGeometry args={[0.12, 16, 14]} />
          <Skin color={look.skin} />
        </mesh>
        <mesh position={[0.22, -0.04, 0.16]} scale={[1, 0.85, 0.8]}>
          <sphereGeometry args={[0.12, 16, 14]} />
          <Skin color={look.skin} />
        </mesh>
      </group>
      <mesh position={[-0.27, 1.5, -0.02]} scale={[0.72, 1, 0.85]} castShadow>
        <sphereGeometry args={[0.08, 14, 14]} />
        <Skin color={look.skin} />
      </mesh>
      <mesh position={[0.27, 1.5, -0.02]} scale={[0.72, 1, 0.85]} castShadow>
        <sphereGeometry args={[0.08, 14, 14]} />
        <Skin color={look.skin} />
      </mesh>
      <mesh position={[0, 1.22, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.08, 6, 12]} />
        <Skin color={look.skin} />
      </mesh>
      <Face skin={look.skin} hair={look.hair} />
      <Hair cosmetics={cosmetics} />
      <Glasses cosmetics={cosmetics} />
      <Hat cosmetics={cosmetics} />

      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[torsoR, 0.32, 8, 16]} />
        <Cloth color={look.shirt} />
      </mesh>
      <mesh position={[0, 0.74, -0.01]} scale={[0.92, 0.42, 0.72]} castShadow>
        <sphereGeometry args={[torsoR * 1.02, 16, 14]} />
        <Cloth color={look.shirt} />
      </mesh>
      {hoodie && (
        <>
          <mesh position={[0, 1.34, -0.08]} rotation={[0.42, 0, 0]} castShadow>
            <sphereGeometry args={[0.26, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <Cloth color={look.shirt} />
          </mesh>
          <mesh position={[0, 0.78, 0.2]} castShadow>
            <boxGeometry args={[0.28, 0.13, 0.08]} />
            <Cloth color={look.shirt} />
          </mesh>
          <mesh position={[-0.07, 1.16, 0.18]} rotation={[0.15, 0, 0.08]}>
            <capsuleGeometry args={[0.01, 0.18, 3, 8]} />
            <Cloth color="#f7f1e8" />
          </mesh>
          <mesh position={[0.07, 1.16, 0.18]} rotation={[0.15, 0, -0.08]}>
            <capsuleGeometry args={[0.01, 0.18, 3, 8]} />
            <Cloth color="#f7f1e8" />
          </mesh>
          <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.03, 8, 22]} />
            <Cloth color={look.shirt} />
          </mesh>
        </>
      )}
      {blazer && (
        <>
          <mesh position={[0, 0.96, 0.02]} scale={[1.08, 1, 1.08]}>
            <capsuleGeometry args={[0.2, 0.32, 6, 14]} />
            <Cloth color={look.shirt} />
          </mesh>
          <mesh position={[0, 1.08, 0.16]}>
            <boxGeometry args={[0.14, 0.22, 0.04]} />
            <Cloth color="#f4efe6" />
          </mesh>
          <mesh position={[-0.12, 1.06, 0.2]} rotation={[0, 0, 0.38]} castShadow>
            <boxGeometry args={[0.12, 0.28, 0.035]} />
            <Cloth color={look.shirt} />
          </mesh>
          <mesh position={[0.12, 1.06, 0.2]} rotation={[0, 0, -0.38]} castShadow>
            <boxGeometry args={[0.12, 0.28, 0.035]} />
            <Cloth color={look.shirt} />
          </mesh>
          <mesh position={[-0.07, 0.78, 0.22]}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <Cloth color="#e8c547" shiny />
          </mesh>
          <mesh position={[0.07, 0.78, 0.22]}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <Cloth color="#e8c547" shiny />
          </mesh>
          <mesh position={[0.16, 0.86, 0.2]}>
            <boxGeometry args={[0.06, 0.05, 0.02]} />
            <Cloth color="#d64545" />
          </mesh>
        </>
      )}
      {!hoodie && !blazer && (
        <mesh position={[0, 1.18, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.11, 0.028, 10, 22]} />
          <Cloth color="#f6f3ee" />
        </mesh>
      )}
      {cosmetics.scarf && (
        <group position={[0, 1.18, 0.02]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.15, 0.042, 12, 24]} />
            <Cloth color="#c43c4a" />
          </mesh>
          <mesh position={[0.11, -0.18, 0.1]} rotation={[0.25, 0.1, 0.28]} castShadow>
            <boxGeometry args={[0.09, 0.3, 0.035]} />
            <Cloth color="#c43c4a" />
          </mesh>
          <mesh position={[0.11, -0.08, 0.1]}>
            <boxGeometry args={[0.09, 0.02, 0.04]} />
            <Cloth color="#f4efe6" />
          </mesh>
        </group>
      )}

      <mesh position={[-(torsoR + 0.02), 1.04, 0]} castShadow>
        <sphereGeometry args={[0.095, 14, 14]} />
        <Cloth color={look.shirt} />
      </mesh>
      <mesh position={[torsoR + 0.02, 1.04, 0]} castShadow>
        <sphereGeometry args={[0.095, 14, 14]} />
        <Cloth color={look.shirt} />
      </mesh>
      <group ref={leftArm} position={[-(torsoR + 0.02), 1.02, -0.02]}>
        <Arm look={look} watch={cosmetics.watch} />
      </group>
      <group ref={rightArm} position={[torsoR + 0.02, 1.02, -0.02]}>
        <Arm look={look} />
      </group>
      <group ref={leftLeg} position={[-0.125, 0.58, 0]}>
        <Leg look={look} />
      </group>
      <group ref={rightLeg} position={[0.125, 0.58, 0]}>
        <Leg look={look} />
      </group>
      <Backpack cosmetics={cosmetics} />
      {cosmetics.car && <Car />}
      {cosmetics.tank && <Tank />}
      {cosmetics.bugatti && <Bugatti />}
    </group>
  )
}

function Car() {
  return (
    <group position={[0, 0.2, 0.12]} rotation={[0, 0, 0]}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.92, 0.34, 1.05]} />
        <meshStandardMaterial color="#d64545" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.35, -0.12]} castShadow>
        <boxGeometry args={[0.54, 0.3, 0.42]} />
        <meshStandardMaterial color="#ef8354" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.36, 0.11]}>
        <boxGeometry args={[0.42, 0.16, 0.012]} />
        <meshStandardMaterial color="#bde0fe" roughness={0.2} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.47, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.018, 10, 20]} />
        <meshStandardMaterial color="#202124" roughness={0.55} />
      </mesh>
      {[-0.48, 0.48].flatMap((x) => [-0.32, 0.32].map((z) => (
        <group key={`${x}-${z}`} position={[x, -0.04, z]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
            <meshStandardMaterial color="#202124" roughness={0.8} />
          </mesh>
          <mesh position={[x < 0 ? -0.045 : 0.045, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.012, 16]} />
            <meshStandardMaterial color="#b8c0c8" metalness={0.55} roughness={0.35} />
          </mesh>
        </group>
      )))}
    </group>
  )
}

function Tank() {
  return (
    <group position={[0, 0.22, 0.12]}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[1.05, 0.34, 1.08]} />
        <meshStandardMaterial color="#526b3f" roughness={0.9} />
      </mesh>
      {[-0.57, 0.57].map((x) => (
        <group key={x} position={[x, 0.02, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.28, 0.98]} />
            <meshStandardMaterial color="#293524" roughness={1} />
          </mesh>
          {[-0.3, 0, 0.3].map((z) => (
            <mesh key={z} position={[0, -0.02, z]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.095, 0.095, 0.025, 14]} />
              <meshStandardMaterial color="#111712" roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.34, -0.02]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.16, 12]} />
        <meshStandardMaterial color="#627c4a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.43, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.14, 12]} />
        <meshStandardMaterial color="#405532" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.43, 0.62]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.72, 12]} />
        <meshStandardMaterial color="#293524" roughness={0.85} />
      </mesh>
    </group>
  )
}

function Bugatti() {
  return (
    <group position={[0, 0.2, 0.14]}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[1.02, 0.24, 1.2]} />
        <meshStandardMaterial color="#123b63" roughness={0.45} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.25, -0.08]} castShadow>
        <boxGeometry args={[0.58, 0.22, 0.5]} />
        <meshStandardMaterial color="#1b5687" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.27, 0.2]}>
        <boxGeometry args={[0.46, 0.12, 0.012]} />
        <meshStandardMaterial color="#9ed8ed" transparent opacity={0.82} roughness={0.12} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.19, 0.615]}>
        <boxGeometry args={[0.58, 0.1, 0.035]} />
        <meshStandardMaterial color="#d9edf2" roughness={0.25} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.18, -0.6]} castShadow>
        <boxGeometry args={[0.78, 0.08, 0.08]} />
        <meshStandardMaterial color="#0c2945" roughness={0.5} metalness={0.3} />
      </mesh>
      {[-0.46, 0.46].flatMap((x) => [-0.38, 0.38].map((z) => (
        <group key={`${x}-${z}`} position={[x, -0.03, z]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 18]} />
            <meshStandardMaterial color="#101820" roughness={0.8} />
          </mesh>
          <mesh position={[x < 0 ? -0.045 : 0.045, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.012, 16]} />
            <meshStandardMaterial color="#c9d2d8" metalness={0.7} roughness={0.25} />
          </mesh>
        </group>
      )))}
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.1, 0.615]}>
          <sphereGeometry args={[0.045, 14, 10]} />
          <meshStandardMaterial color="#fff1b8" emissive="#ffd166" emissiveIntensity={0.45} />
        </mesh>
      ))}
    </group>
  )
}

function Arm({
  look,
  watch = false,
}: {
  look: { skin: string; shirt: string }
  watch?: boolean
}) {
  return (
    <>
      <mesh position={[0, 0.02, 0]} castShadow>
        <sphereGeometry args={[0.072, 14, 14]} />
        <Cloth color={look.shirt} />
      </mesh>
      <mesh position={[0, -0.18, 0]} castShadow>
        <capsuleGeometry args={[0.058, 0.2, 6, 12]} />
        <Cloth color={look.shirt} />
      </mesh>
      <mesh position={[0, -0.32, 0]}>
        <torusGeometry args={[0.052, 0.012, 8, 14]} />
        <Cloth color={look.shirt} />
      </mesh>
      <mesh position={[0, -0.38, 0]} castShadow>
        <sphereGeometry args={[0.06, 14, 14]} />
        <Skin color={look.skin} />
      </mesh>
      <mesh position={[0.022, -0.41, 0.02]} scale={[0.65, 0.8, 0.65]}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <Skin color={look.skin} />
      </mesh>
      {watch && (
        <group position={[0, -0.3, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.072, 0.014, 8, 18]} />
            <Cloth color="#e8c547" shiny />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.038, 0.038, 0.016, 14]} />
            <meshPhysicalMaterial color="#eef7ff" roughness={0.12} metalness={0.35} />
          </mesh>
        </group>
      )}
    </>
  )
}

function Leg({ look }: { look: { pants: string; shoes: string; skin: string } }) {
  const gold = look.shoes === '#ffd166'
  return (
    <>
      <mesh position={[0, -0.18, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.24, 6, 12]} />
        <Cloth color={look.pants} />
      </mesh>
      <mesh position={[0, -0.34, 0]}>
        <torusGeometry args={[0.078, 0.016, 8, 14]} />
        <Cloth color={look.pants} />
      </mesh>
      <mesh position={[0, -0.44, 0.05]} castShadow>
        <capsuleGeometry args={[0.088, 0.07, 6, 12]} />
        <Cloth color={look.shoes} shiny={gold} />
      </mesh>
      <mesh position={[0, -0.5, 0.08]} castShadow>
        <sphereGeometry args={[0.09, 12, 12]} />
        <Cloth color={look.shoes} shiny={gold} />
      </mesh>
      <mesh position={[0, -0.5, 0.04]}>
        <boxGeometry args={[0.16, 0.028, 0.22]} />
        <Cloth color={gold ? '#c9a227' : '#2a2420'} />
      </mesh>
      <mesh position={[0, -0.4, 0.09]}>
        <boxGeometry args={[0.06, 0.025, 0.08]} />
        <Cloth color="#f4efe6" />
      </mesh>
    </>
  )
}

function Face({ skin, hair }: { skin: string; hair: string }) {
  return (
    <group position={[0, 1.5, 0.22]}>
      <Eye x={-0.1} />
      <Eye x={0.1} />
      <mesh position={[-0.1, 0.115, 0.08]} rotation={[0.1, 0, 0.16]}>
        <capsuleGeometry args={[0.01, 0.07, 3, 8]} />
        <Cloth color={hair} />
      </mesh>
      <mesh position={[0.1, 0.115, 0.08]} rotation={[0.1, 0, -0.16]}>
        <capsuleGeometry args={[0.01, 0.07, 3, 8]} />
        <Cloth color={hair} />
      </mesh>
      <mesh position={[-0.16, -0.05, 0.08]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshPhysicalMaterial color="#f09aa0" transparent opacity={0.42} roughness={0.55} />
      </mesh>
      <mesh position={[0.16, -0.05, 0.08]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshPhysicalMaterial color="#f09aa0" transparent opacity={0.42} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.01, 0.12]}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <Skin color={skin} />
      </mesh>
      <mesh position={[0, -0.11, 0.11]} rotation={[0.2, 0, Math.PI]}>
        <torusGeometry args={[0.042, 0.009, 8, 16, Math.PI]} />
        <meshPhysicalMaterial color="#c56b62" roughness={0.4} />
      </mesh>
    </group>
  )
}

function Eye({ x }: { x: number }) {
  return (
    <group position={[x, 0.035, 0.1]}>
      <mesh scale={[1, 1.08, 0.7]}>
        <sphereGeometry args={[0.062, 16, 14]} />
        <meshPhysicalMaterial color="#fffaf4" roughness={0.28} />
      </mesh>
      <mesh position={[0, -0.004, 0.03]}>
        <sphereGeometry args={[0.032, 14, 14]} />
        <meshPhysicalMaterial color="#4a3426" roughness={0.28} />
      </mesh>
      <mesh position={[0, -0.004, 0.048]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshPhysicalMaterial color="#16110e" roughness={0.2} />
      </mesh>
      <mesh position={[0.012, 0.014, 0.058]}>
        <sphereGeometry args={[0.011, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.012, -0.008, 0.054]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.05, 0.02]} rotation={[0.2, 0, 0]}>
        <capsuleGeometry args={[0.01, 0.08, 3, 8]} />
        <meshPhysicalMaterial color="#2b211c" roughness={0.5} />
      </mesh>
    </group>
  )
}

function Hair({ cosmetics }: { cosmetics: Cosmetics }) {
  const color = cosmetics.hair
  if (cosmetics.hairStyle === 'spike') {
    return (
      <group position={[0, 1.66, -0.02]}>
        <mesh castShadow>
          <sphereGeometry args={[0.3, 20, 16]} />
          <Cloth color={color} />
        </mesh>
        {[-0.16, -0.06, 0.05, 0.15].map((x, i) => (
          <mesh key={x} position={[x, 0.16, -0.02]} rotation={[0.18, 0, x * 0.55]} castShadow>
            <capsuleGeometry args={[0.055 - i * 0.004, 0.2, 5, 8]} />
            <Cloth color={color} />
          </mesh>
        ))}
      </group>
    )
  }
  if (cosmetics.hairStyle === 'bun') {
    return (
      <group>
        <mesh position={[0, 1.66, -0.03]} castShadow>
          <sphereGeometry args={[0.33, 22, 18]} />
          <Cloth color={color} />
        </mesh>
        <mesh position={[0, 1.52, 0.2]} scale={[1.15, 0.32, 0.42]} castShadow>
          <sphereGeometry args={[0.16, 14, 10]} />
          <Cloth color={color} />
        </mesh>
        <mesh position={[0, 1.88, -0.12]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <Cloth color={color} />
        </mesh>
        <mesh position={[0, 1.78, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.018, 8, 16]} />
          <Cloth color="#e8c547" shiny />
        </mesh>
      </group>
    )
  }
  if (cosmetics.hairStyle === 'long') {
    return (
      <group>
        <mesh position={[0, 1.66, -0.03]} castShadow>
          <sphereGeometry args={[0.34, 22, 18]} />
          <Cloth color={color} />
        </mesh>
        <mesh position={[0, 1.52, 0.2]} scale={[1.2, 0.34, 0.45]} castShadow>
          <sphereGeometry args={[0.17, 14, 10]} />
          <Cloth color={color} />
        </mesh>
        <mesh position={[-0.2, 1.22, -0.06]} rotation={[0.2, 0, 0.18]} castShadow>
          <capsuleGeometry args={[0.1, 0.48, 6, 12]} />
          <Cloth color={color} />
        </mesh>
        <mesh position={[0.2, 1.22, -0.06]} rotation={[0.2, 0, -0.18]} castShadow>
          <capsuleGeometry args={[0.1, 0.48, 6, 12]} />
          <Cloth color={color} />
        </mesh>
        <mesh position={[0, 1.05, -0.16]} castShadow>
          <sphereGeometry args={[0.16, 12, 12]} />
          <Cloth color={color} />
        </mesh>
      </group>
    )
  }
  return (
    <group>
      <mesh position={[0, 1.62, -0.08]} rotation={[0.35, 0, 0]} castShadow>
        <sphereGeometry args={[0.34, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.68]} />
        <Cloth color={color} />
      </mesh>
      <mesh position={[-0.22, 1.48, 0.02]} scale={[0.7, 1, 0.85]} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <Cloth color={color} />
      </mesh>
      <mesh position={[0.22, 1.48, 0.02]} scale={[0.7, 1, 0.85]} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <Cloth color={color} />
      </mesh>
      <mesh position={[-0.1, 1.58, 0.22]} rotation={[0.4, 0.2, 0.1]} scale={[1, 0.32, 0.45]} castShadow>
        <sphereGeometry args={[0.11, 12, 10]} />
        <Cloth color={color} />
      </mesh>
      <mesh position={[0.1, 1.58, 0.22]} rotation={[0.4, -0.2, -0.1]} scale={[1, 0.32, 0.45]} castShadow>
        <sphereGeometry args={[0.11, 12, 10]} />
        <Cloth color={color} />
      </mesh>
    </group>
  )
}

function Glasses({ cosmetics }: { cosmetics: Cosmetics }) {
  if (cosmetics.glasses === 'none') return null
  const sun = cosmetics.glasses === 'sun'
  const round = cosmetics.glasses === 'round'
  const frame = sun ? '#1b1b1b' : '#2c3a4a'
  const lens = sun ? '#2a3340' : '#c5e8f4'
  return (
    <group position={[0, 1.53, 0.34]}>
      {round ? (
        <>
          <mesh position={[-0.1, 0, 0]}>
            <torusGeometry args={[0.062, 0.01, 10, 20]} />
            <Cloth color={frame} shiny />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
            <torusGeometry args={[0.062, 0.01, 10, 20]} />
            <Cloth color={frame} shiny />
          </mesh>
          <mesh position={[-0.1, 0, 0.002]}>
            <circleGeometry args={[0.052, 18]} />
            <meshPhysicalMaterial color={lens} transparent opacity={sun ? 0.72 : 0.18} roughness={0.08} metalness={0.2} />
          </mesh>
          <mesh position={[0.1, 0, 0.002]}>
            <circleGeometry args={[0.052, 18]} />
            <meshPhysicalMaterial color={lens} transparent opacity={sun ? 0.72 : 0.18} roughness={0.08} metalness={0.2} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[-0.1, 0, 0.004]}>
            <boxGeometry args={[0.11, 0.06, 0.006]} />
            <meshPhysicalMaterial color={lens} transparent opacity={sun ? 0.62 : 0.14} roughness={0.08} metalness={0.22} />
          </mesh>
          <mesh position={[0.1, 0, 0.004]}>
            <boxGeometry args={[0.11, 0.06, 0.006]} />
            <meshPhysicalMaterial color={lens} transparent opacity={sun ? 0.62 : 0.14} roughness={0.08} metalness={0.22} />
          </mesh>
          <mesh position={[-0.1, 0.034, 0.006]}>
            <boxGeometry args={[0.118, 0.01, 0.01]} />
            <Cloth color={frame} shiny />
          </mesh>
          <mesh position={[-0.1, -0.034, 0.006]}>
            <boxGeometry args={[0.118, 0.01, 0.01]} />
            <Cloth color={frame} shiny />
          </mesh>
          <mesh position={[-0.156, 0, 0.006]}>
            <boxGeometry args={[0.01, 0.068, 0.01]} />
            <Cloth color={frame} shiny />
          </mesh>
          <mesh position={[-0.044, 0, 0.006]}>
            <boxGeometry args={[0.01, 0.068, 0.01]} />
            <Cloth color={frame} shiny />
          </mesh>
          <mesh position={[0.1, 0.034, 0.006]}>
            <boxGeometry args={[0.118, 0.01, 0.01]} />
            <Cloth color={frame} shiny />
          </mesh>
          <mesh position={[0.1, -0.034, 0.006]}>
            <boxGeometry args={[0.118, 0.01, 0.01]} />
            <Cloth color={frame} shiny />
          </mesh>
          <mesh position={[0.156, 0, 0.006]}>
            <boxGeometry args={[0.01, 0.068, 0.01]} />
            <Cloth color={frame} shiny />
          </mesh>
          <mesh position={[0.044, 0, 0.006]}>
            <boxGeometry args={[0.01, 0.068, 0.01]} />
            <Cloth color={frame} shiny />
          </mesh>
        </>
      )}
      <mesh>
        <boxGeometry args={[0.055, 0.012, 0.012]} />
        <Cloth color={frame} shiny />
      </mesh>
      <mesh position={[-0.2, -0.01, -0.08]} rotation={[0.08, 0.55, 0]}>
        <boxGeometry args={[0.12, 0.01, 0.01]} />
        <Cloth color={frame} shiny />
      </mesh>
      <mesh position={[0.2, -0.01, -0.08]} rotation={[0.08, -0.55, 0]}>
        <boxGeometry args={[0.12, 0.01, 0.01]} />
        <Cloth color={frame} shiny />
      </mesh>
    </group>
  )
}

function Hat({ cosmetics }: { cosmetics: Cosmetics }) {
  if (cosmetics.hat === 'none') return null
  if (cosmetics.hat === 'cap') {
    return (
      <group position={[0, 1.78, 0.02]}>
        <mesh castShadow>
          <sphereGeometry args={[0.27, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <Cloth color={cosmetics.shirt} />
        </mesh>
        <mesh position={[0, -0.02, 0.22]} rotation={[-0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.28, 0.03, 0.16]} />
          <Cloth color={cosmetics.shirt} />
        </mesh>
        <mesh position={[0, 0.02, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.018, 8, 20]} />
          <Cloth color="#f4efe6" />
        </mesh>
      </group>
    )
  }
  if (cosmetics.hat === 'beanie') {
    return (
      <group position={[0, 1.76, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.3, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <Cloth color="#3ee0b3" />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.03, 8, 18]} />
          <Cloth color="#2bb894" />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.065, 12, 12]} />
          <Cloth color="#f4efe6" />
        </mesh>
      </group>
    )
  }
  return (
    <group position={[0, 1.72, 0.12]}>
      <mesh rotation={[0.15, 0, 0.2]} castShadow>
        <boxGeometry args={[0.16, 0.08, 0.05]} />
        <Cloth color="#ff6b9d" />
      </mesh>
      <mesh position={[-0.08, 0, 0]} rotation={[0.15, 0, 0.55]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.03]} />
        <Cloth color="#ff6b9d" />
      </mesh>
      <mesh position={[0.08, 0, 0]} rotation={[0.15, 0, -0.55]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.03]} />
        <Cloth color="#ff6b9d" />
      </mesh>
      <mesh position={[0, 0.01, 0.01]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <Cloth color="#e8c547" shiny />
      </mesh>
    </group>
  )
}

function Backpack({ cosmetics }: { cosmetics: Cosmetics }) {
  if (cosmetics.backpack === 'none') return null
  if (cosmetics.backpack === 'satchel') {
    return (
      <group position={[0.3, 0.84, 0.06]} rotation={[0, 0.15, -0.42]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.09, 0.14, 6, 12]} />
          <Cloth color="#8d6e4c" />
        </mesh>
        <mesh position={[0, 0.02, 0.04]}>
          <boxGeometry args={[0.1, 0.08, 0.04]} />
          <Cloth color="#6e5438" />
        </mesh>
        <mesh position={[0, 0.14, 0]} rotation={[0, 0, 0.7]}>
          <torusGeometry args={[0.09, 0.014, 8, 16]} />
          <Cloth color="#c9a227" shiny />
        </mesh>
      </group>
    )
  }
  return (
    <group position={[0, 0.92, -0.26]}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.4, 0.16]} />
        <Cloth color="#2e4a62" />
      </mesh>
      <mesh position={[0, 0.06, 0.03]}>
        <boxGeometry args={[0.24, 0.14, 0.1]} />
        <Cloth color="#1f6f8b" />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.28, 0.05, 0.18]} />
        <Cloth color="#e8c547" shiny />
      </mesh>
      <mesh position={[-0.12, 0.22, 0.14]} rotation={[0.4, 0, 0.15]}>
        <capsuleGeometry args={[0.015, 0.28, 3, 8]} />
        <Cloth color="#2e4a62" />
      </mesh>
      <mesh position={[0.12, 0.22, 0.14]} rotation={[0.4, 0, -0.15]}>
        <capsuleGeometry args={[0.015, 0.28, 3, 8]} />
        <Cloth color="#2e4a62" />
      </mesh>
    </group>
  )
}
