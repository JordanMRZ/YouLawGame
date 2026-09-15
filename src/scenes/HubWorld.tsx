import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type ReactNode } from 'react'
import { Group } from 'three'
import { WorldLabel } from '../components/WorldLabel'
import { levelCatalog } from '../data/levels'
import { palettes } from '../data/worlds'
import { PlayerVisual } from '../player/PlayerVisual'
import { useGameStore } from '../store/gameStore'
import { HubCamera } from './HubCamera'
import { HubDecor } from './HubDecor'
import { ShopStage } from './ShopStage'

export function HubWorld() {
  const selected = useGameStore((s) => s.selectedLevel)
  const unlocked = useGameStore((s) => s.save.unlockedLevel)
  const equipped = useGameStore((s) => s.save.cosmetics)
  const preview = useGameStore((s) => s.shopPreview)
  const cosmetics = preview ?? equipped
  const shopOpen = useGameStore((s) => s.shopOpen)
  const stars = useGameStore((s) => s.save.levels)
  const group = useRef<Group>(null)

  const nodes = useMemo(
    () =>
      levelCatalog.map((item, index) => {
        const t = (index / 10) * Math.PI * 2 - Math.PI * 0.5
        return {
          ...item,
          x: Math.cos(t) * 11.2,
          y: 0.28,
          z: -5.2 + Math.sin(t) * 11.2,
          locked: item.id > unlocked,
          starCount: stars[String(item.id)]?.stars ?? 0,
        }
      }),
    [stars, unlocked],
  )

  useFrame((state) => {
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.03
  })

  return (
    <>
      <HubCamera />
      {shopOpen ? (
        <ShopStage />
      ) : (
        <>
          <color attach="background" args={['#9ad7f5']} />
          <fog attach="fog" args={['#b7e3f6', 22, 78]} />
          <hemisphereLight args={['#fff6d8', '#3cbf7a', 1]} />
          <ambientLight intensity={0.62} />
          <directionalLight position={[10, 18, 8]} intensity={1.45} castShadow />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, -6]}>
            <circleGeometry args={[34, 40]} />
            <meshLambertMaterial color="#3cbf7a" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, -6]}>
            <circleGeometry args={[18, 36]} />
            <meshLambertMaterial color="#45c97f" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.38, -4.5]}>
            <circleGeometry args={[8.2, 32]} />
            <meshLambertMaterial color="#d9c2a0" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, -4.5]}>
            <circleGeometry args={[6.4, 32]} />
            <meshLambertMaterial color="#e6d3b1" />
          </mesh>
          <HubDecor />
        </>
      )}
      <Turntable shopOpen={shopOpen}>
        <PlayerVisual cosmetics={cosmetics} pose={shopOpen ? 'turntable' : 'idle'} />
      </Turntable>
      {!shopOpen && (
        <group ref={group}>
          <LevelPath nodes={nodes} />
          {nodes.map((node) => (
            <HubPad key={node.id} node={node} selected={selected === node.id} />
          ))}
        </group>
      )}
      {!shopOpen && <WorldLabel text="YOU LAW GAME" position={[0, 4.8, -5.2]} width={12} color="#fff6d8" />}
    </>
  )
}

function Turntable({ children, shopOpen }: { children: ReactNode; shopOpen: boolean }) {
  const ref = useRef<Group>(null)
  const drag = useRef({ on: false, last: 0, yaw: 0 })
  const wasOpen = useRef(false)

  useFrame((_) => {
    if (!ref.current) return
    if (shopOpen && !wasOpen.current) drag.current.yaw = 0
    wasOpen.current = shopOpen
    if (!shopOpen) drag.current.yaw = 0
    ref.current.rotation.y = drag.current.yaw
  })

  return (
    <group
      ref={ref}
      position={[0, shopOpen ? 0.18 : 0, -1.5]}
      scale={shopOpen ? 1.2 : 1}
      onPointerDown={(event) => {
        event.stopPropagation()
        drag.current.on = true
        drag.current.last = event.clientX
      }}
      onPointerUp={() => {
        drag.current.on = false
      }}
      onPointerLeave={() => {
        drag.current.on = false
      }}
      onPointerMove={(event) => {
        if (!drag.current.on) return
        drag.current.yaw += (event.clientX - drag.current.last) * 0.012
        drag.current.last = event.clientX
      }}
    >
      {children}
      <mesh position={[0, 0.85, 0]} visible={false}>
        <cylinderGeometry args={[0.95, 0.95, 1.9, 12]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}

function LevelPath({
  nodes,
}: {
  nodes: { x: number; z: number; locked: boolean }[]
}) {
  const first = nodes[0]
  return (
    <group>
      {first && <PathStone from={[0, -1.6]} to={[first.x, first.z]} open />}
      {nodes.slice(0, -1).map((node, index) => {
        const next = nodes[index + 1]
        if (!next) return null
        return (
          <PathStone
            key={`${node.x}-${next.x}`}
            from={[node.x, node.z]}
            to={[next.x, next.z]}
            open={!next.locked}
          />
        )
      })}
    </group>
  )
}

function PathStone({
  from,
  to,
  open,
}: {
  from: [number, number]
  to: [number, number]
  open: boolean
}) {
  const dx = to[0] - from[0]
  const dz = to[1] - from[1]
  const len = Math.hypot(dx, dz)
  return (
    <group position={[(from[0] + to[0]) / 2, -0.34, (from[1] + to[1]) / 2]} rotation={[0, Math.atan2(dx, dz), 0]}>
      <mesh>
        <boxGeometry args={[1.05, 0.08, Math.max(0.4, len - 2.1)]} />
        <meshLambertMaterial color={open ? '#e6c36a' : '#8a8478'} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.42, 0.05, Math.max(0.3, len - 2.2)]} />
        <meshLambertMaterial color={open ? '#fff1b8' : '#6b665c'} />
      </mesh>
    </group>
  )
}

function HubPad({
  node,
  selected,
}: {
  node: {
    id: number
    world: keyof typeof palettes
    x: number
    y: number
    z: number
    locked: boolean
    starCount: number
  }
  selected: boolean
}) {
  const bob = useRef<Group>(null)
  useFrame((state) => {
    if (!bob.current) return
    const lift = selected && !node.locked ? 0.12 : 0
    bob.current.position.y = node.y + lift + Math.sin(state.clock.elapsedTime * 1.6 + node.id) * 0.05
  })
  const color = palettes[node.world].accent
  return (
    <group
      ref={bob}
      position={[node.x, node.y, node.z]}
      onClick={(event) => {
        event.stopPropagation()
        if (node.locked) return
        useGameStore.getState().setSelectedLevel(node.id)
      }}
      onPointerOver={() => {
        document.body.style.cursor = node.locked ? 'not-allowed' : 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <mesh castShadow>
        <cylinderGeometry args={[1.42, 1.62, 0.58, 16]} />
        <meshLambertMaterial color={node.locked ? '#6b7280' : '#7c5a36'} />
      </mesh>
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 20]} />
        <meshLambertMaterial color={node.locked ? '#9aa3ad' : color} />
      </mesh>
      <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.28, 1.5, 20]} />
        <meshLambertMaterial color={node.locked ? '#d1d5db' : '#f4fbff'} />
      </mesh>
      <mesh position={[0.62, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 1.15, 8]} />
        <meshLambertMaterial color="#6b4a32" />
      </mesh>
      <mesh position={[0.86, 1.28, 0]} castShadow>
        <boxGeometry args={[0.48, 0.32, 0.06]} />
        <meshLambertMaterial color={node.locked ? '#9ca3af' : color} />
      </mesh>
      {selected && !node.locked && (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.78, 0.08, 10, 28]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
      <WorldLabel
        text={node.locked ? 'X' : String(node.id).padStart(2, '0')}
        position={[0, 1.55, 0]}
        width={2.2}
      />
      {!node.locked && (
        <WorldLabel
          text={`${'★'.repeat(node.starCount)}${'☆'.repeat(Math.max(0, 5 - node.starCount))}`}
          position={[0, 0.72, 1.05]}
          width={2.6}
          color="#ffd166"
        />
      )}
    </group>
  )
}
