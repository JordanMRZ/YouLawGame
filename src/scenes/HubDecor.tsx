import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group } from 'three'

export function HubDecor() {
  return (
    <>
      <Sun />
      <Clouds />
      <Hills />
      <Pond />
      <Fountain />
      <Trees />
      <Flowers />
      <Path />
      <Lanterns />
      <Birds />
      <Butterflies />
      <Sparkles />
    </>
  )
}

function Sun() {
  return (
    <group position={[14, 16, -18]}>
      <mesh>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial color="#ffe08a" />
      </mesh>
      <pointLight intensity={2.2} distance={48} color="#ffe6a8" />
    </group>
  )
}

function Clouds() {
  const clouds = useMemo(
    () => [
      { x: -10, y: 11, z: -16, s: 1.3, speed: 0.35 },
      { x: 4, y: 13, z: -22, s: 1.7, speed: 0.22 },
      { x: 12, y: 10, z: -12, s: 1.1, speed: 0.4 },
      { x: -16, y: 12.5, z: -8, s: 1.4, speed: 0.18 },
      { x: 0, y: 14, z: -28, s: 2, speed: 0.12 },
      { x: 8, y: 9, z: -6, s: 0.85, speed: 0.48 },
    ],
    [],
  )
  return (
    <>
      {clouds.map((cloud) => (
        <Cloud key={`${cloud.x}-${cloud.z}`} {...cloud} />
      ))}
    </>
  )
}

function Cloud({ x, y, z, s, speed }: { x: number; y: number; z: number; s: number; speed: number }) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.position.x += dt * speed
    if (ref.current.position.x > 24) ref.current.position.x = -24
  })
  return (
    <group ref={ref} position={[x, y, z]} scale={s}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.15, 10, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[1.1, -0.1, 0.15]}>
        <sphereGeometry args={[0.85, 10, 8]} />
        <meshBasicMaterial color="#f7fbff" />
      </mesh>
      <mesh position={[-1, -0.15, 0.1]}>
        <sphereGeometry args={[0.78, 10, 8]} />
        <meshBasicMaterial color="#eef6ff" />
      </mesh>
      <mesh position={[0.2, 0.45, -0.1]}>
        <sphereGeometry args={[0.7, 10, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function Hills() {
  const pines = useMemo(
    () =>
      [
        [-18, -22, 1.15],
        [-14.5, -24.5, 0.95],
        [-11, -21.5, 1.35],
        [-7.2, -26, 1.05],
        [-3, -23.5, 1.4],
        [2.4, -25, 1.2],
        [6.8, -22.8, 0.9],
        [11.2, -25.5, 1.3],
        [15.4, -23, 1.1],
        [19, -26.2, 1.45],
        [-20, -18, 0.8],
        [18.5, -18.5, 0.85],
      ] as [number, number, number][],
    [],
  )
  return (
    <group>
      <mesh position={[-14, -1.6, -24]} scale={[1.6, 0.55, 1.15]} castShadow>
        <sphereGeometry args={[7.4, 18, 12]} />
        <meshLambertMaterial color="#2d8f58" />
      </mesh>
      <mesh position={[0, -2.4, -28]} scale={[2.2, 0.48, 1.3]} castShadow>
        <sphereGeometry args={[8.6, 18, 12]} />
        <meshLambertMaterial color="#247a4a" />
      </mesh>
      <mesh position={[15, -1.8, -25]} scale={[1.7, 0.52, 1.2]} castShadow>
        <sphereGeometry args={[7.8, 18, 12]} />
        <meshLambertMaterial color="#318f54" />
      </mesh>
      <mesh position={[-8, 0.4, -22]} scale={[1.1, 0.7, 1]} castShadow>
        <sphereGeometry args={[4.2, 16, 12]} />
        <meshLambertMaterial color="#36a35e" />
      </mesh>
      <mesh position={[9.5, 0.2, -23]} scale={[1.2, 0.65, 1]} castShadow>
        <sphereGeometry args={[4.6, 16, 12]} />
        <meshLambertMaterial color="#2f9a56" />
      </mesh>
      <BushClump position={[-16.5, 2.1, -21]} />
      <BushClump position={[-6.4, 2.6, -20.5]} />
      <BushClump position={[5.8, 2.4, -21.2]} />
      <BushClump position={[16.2, 2.0, -22]} />
      {pines.map(([x, z, s]) => (
        <Pine key={`${x}-${z}`} position={[x, 1.1, z]} scale={s} />
      ))}
    </group>
  )
}

function BushClump({ position }: { position: [number, number, number] }) {
  const bits = useMemo(
    () =>
      [
        [0, 0.4, 0, 1.15, '#2b8a4c'],
        [0.7, 0.15, 0.25, 0.82, '#348a52'],
        [-0.65, 0.2, 0.15, 0.78, '#237544'],
        [0.2, 0.7, -0.3, 0.7, '#3aa85c'],
        [-0.35, 0.55, 0.45, 0.62, '#2f7d49'],
        [0.55, 0.45, -0.5, 0.58, '#1f6b3c'],
        [-0.8, 0.05, -0.25, 0.55, '#2d9450'],
        [0.9, -0.05, 0.05, 0.5, '#3b9d5d'],
      ] as [number, number, number, number, string][],
    [],
  )
  return (
    <group position={position}>
      {bits.map(([x, y, z, r, color], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[r, 0]} />
          <meshLambertMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

function Pine({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.7, 7]} />
        <meshLambertMaterial color="#6b4326" />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <coneGeometry args={[0.85, 1.4, 8]} />
        <meshLambertMaterial color="#1f6b3c" />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <coneGeometry args={[0.62, 1.1, 8]} />
        <meshLambertMaterial color="#2b8a4c" />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <coneGeometry args={[0.38, 0.8, 8]} />
        <meshLambertMaterial color="#3aa85c" />
      </mesh>
    </group>
  )
}

function Pond() {
  return (
    <group position={[6.2, -0.32, -3.4]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.1, 24]} />
        <meshStandardMaterial color="#3aa0c8" roughness={0.18} metalness={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.85, 2.15, 24]} />
        <meshLambertMaterial color="#d9c2a0" />
      </mesh>
      <mesh position={[-0.6, 0.08, 0.4]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 10]} />
        <meshLambertMaterial color="#7ad39a" />
      </mesh>
      <mesh position={[0.7, 0.08, -0.3]}>
        <cylinderGeometry args={[0.14, 0.14, 0.04, 10]} />
        <meshLambertMaterial color="#8ee0a8" />
      </mesh>
    </group>
  )
}

function Fountain() {
  const spray = useRef<Group>(null)
  useFrame((state) => {
    if (!spray.current) return
    const t = state.clock.elapsedTime
    spray.current.position.y = 0.55 + Math.sin(t * 3.2) * 0.08
    spray.current.rotation.y = t * 0.6
  })
  return (
    <group position={[-4.4, -0.2, -3.8]}>
      <mesh>
        <cylinderGeometry args={[0.7, 0.82, 0.18, 16]} />
        <meshStandardMaterial color="#e8ddd0" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.4, 10]} />
        <meshStandardMaterial color="#d7c8b4" roughness={0.45} />
      </mesh>
      <group ref={spray}>
        <mesh>
          <sphereGeometry args={[0.16, 10, 10]} />
          <meshBasicMaterial color="#9fe7ff" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.12, 0.12, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#c9f4ff" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  )
}

function Trees() {
  const spots = useMemo(
    () =>
      [
        [-7.4, -2.2],
        [-9.2, -6.5],
        [-11.5, -12],
        [-5.8, -14.5],
        [8.4, -8.2],
        [10.6, -13.4],
        [13.2, -6],
        [-13, -4],
        [5.5, -16],
        [-2.5, -18],
        [9.8, -1.6],
      ] as [number, number][],
    [],
  )
  return (
    <>
      {spots.map(([x, z], i) => (
        <Tree key={`${x}-${z}`} position={[x, -0.2, z]} scale={0.85 + (i % 4) * 0.12} />
      ))}
    </>
  )
}

function Tree({ position, scale }: { position: [number, number, number]; scale: number }) {
  const canopy = useRef<Group>(null)
  useFrame((state) => {
    if (!canopy.current) return
    canopy.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.04
  })
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.4, 8]} />
        <meshLambertMaterial color="#8d5a32" />
      </mesh>
      <group ref={canopy} position={[0, 1.55, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.72, 12, 10]} />
          <meshLambertMaterial color="#2f9d57" />
        </mesh>
        <mesh position={[0.35, 0.1, 0.1]}>
          <sphereGeometry args={[0.42, 10, 8]} />
          <meshLambertMaterial color="#3cb86a" />
        </mesh>
        <mesh position={[-0.28, 0.18, -0.12]}>
          <sphereGeometry args={[0.38, 10, 8]} />
          <meshLambertMaterial color="#247a45" />
        </mesh>
      </group>
    </group>
  )
}

function Flowers() {
  const spots = useMemo(
    () =>
      [
        [-2.4, -1.2, '#ff6b9d'],
        [-1.6, -2.4, '#ffd166'],
        [2.2, -1.8, '#4c6ef5'],
        [1.4, -0.9, '#ff6b9d'],
        [-3.1, -5.2, '#ffe08a'],
        [3.4, -6.1, '#ff8fab'],
        [-0.8, -4.4, '#7ad39a'],
        [4.1, -5.5, '#ffd166'],
      ] as [number, number, string][],
    [],
  )
  return (
    <>
      {spots.map(([x, z, color]) => (
        <group key={`${x}-${z}`} position={[x, -0.28, z]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.24, 6]} />
            <meshLambertMaterial color="#2f9d57" />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshLambertMaterial color={color} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function Path() {
  const stones = useMemo(() => Array.from({ length: 9 }, (_, i) => i), [])
  return (
    <>
      {stones.map((i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, i * 0.12]}
          position={[(i % 2 === 0 ? -0.28 : 0.32) + Math.sin(i) * 0.1, -0.36, -1.4 - i * 0.85]}
        >
          <circleGeometry args={[0.32, 8]} />
          <meshLambertMaterial color={i % 2 ? '#cbb08a' : '#d7c1a4'} />
        </mesh>
      ))}
    </>
  )
}

function Lanterns() {
  return (
    <>
      <Lamp position={[-2.6, 0, -0.8]} />
      <Lamp position={[2.8, 0, -1.1]} />
      <Lamp position={[-6.2, 0, -8.4]} />
      <Lamp position={[6.5, 0, -9]} />
    </>
  )
}

function Lamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 1.1, 8]} />
        <meshStandardMaterial color="#6b4a32" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.18, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color="#ffe29a" emissive="#ffd166" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0, 1.18, 0]} intensity={0.7} distance={5} color="#ffd6a5" />
    </group>
  )
}

function Birds() {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = t * 0.25
  })
  return (
    <group ref={ref} position={[0, 8.5, -10]}>
      {[0, 2.1, 4.2].map((angle) => (
        <Bird key={angle} angle={angle} />
      ))}
    </group>
  )
}

function Bird({ angle }: { angle: number }) {
  const wing = useRef<Group>(null)
  useFrame((state) => {
    if (!wing.current) return
    wing.current.rotation.z = Math.sin(state.clock.elapsedTime * 8 + angle) * 0.45
  })
  return (
    <group position={[Math.cos(angle) * 5.5, Math.sin(angle * 1.3) * 0.6, Math.sin(angle) * 4.2]}>
      <group ref={wing}>
        <mesh rotation={[0.2, 0, 0.55]}>
          <boxGeometry args={[0.42, 0.04, 0.12]} />
          <meshBasicMaterial color="#243447" />
        </mesh>
        <mesh rotation={[0.2, 0, -0.55]} position={[0.02, 0, 0]}>
          <boxGeometry args={[0.42, 0.04, 0.12]} />
          <meshBasicMaterial color="#1b2430" />
        </mesh>
      </group>
    </group>
  )
}

function Butterflies() {
  return (
    <>
      <Butterfly origin={[-2.2, 0.6, -2.4]} hue="#ff6b9d" />
      <Butterfly origin={[1.8, 0.7, -4.8]} hue="#4c6ef5" />
      <Butterfly origin={[-5.4, 0.5, -6]} hue="#ffd166" />
    </>
  )
}

function Butterfly({ origin, hue }: { origin: [number, number, number]; hue: string }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.set(
      origin[0] + Math.sin(t * 1.3) * 0.8,
      origin[1] + Math.sin(t * 2.4) * 0.35,
      origin[2] + Math.cos(t * 1.1) * 0.7,
    )
    ref.current.rotation.y = t * 1.4
    ref.current.rotation.z = Math.sin(t * 10) * 0.5
  })
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.18, 0.02, 0.12]} />
        <meshBasicMaterial color={hue} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[0.14, 0.02, 0.1]} />
        <meshBasicMaterial color="#fffaf4" />
      </mesh>
    </group>
  )
}

function Sparkles() {
  const ref = useRef<Group>(null)
  const dots = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: Math.sin(i * 1.7) * 8,
        y: 0.4 + (i % 5) * 0.35,
        z: -4 + Math.cos(i * 1.1) * 7,
      })),
    [],
  )
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.children.forEach((child, i) => {
      child.position.y = dots[i].y + Math.sin(t * 2 + i) * 0.18
      child.scale.setScalar(0.7 + Math.sin(t * 3 + i) * 0.3)
    })
  })
  return (
    <group ref={ref}>
      {dots.map((dot, i) => (
        <mesh key={i} position={[dot.x, dot.y, dot.z]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color={i % 2 ? '#ffd166' : '#ffffff'} />
        </mesh>
      ))}
    </group>
  )
}
