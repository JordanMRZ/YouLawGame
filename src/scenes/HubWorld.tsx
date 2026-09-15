import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group } from 'three'
import { WorldLabel } from '../components/WorldLabel'
import { levelCatalog } from '../data/levels'
import { palettes } from '../data/worlds'
import { PlayerVisual } from '../player/PlayerVisual'
import { useGameStore } from '../store/gameStore'
import { HubCamera } from './HubCamera'

export function HubWorld() {
  const selected = useGameStore((s) => s.selectedLevel)
  const unlocked = useGameStore((s) => s.save.unlockedLevel)
  const cosmetics = useGameStore((s) => s.save.cosmetics)
  const stars = useGameStore((s) => s.save.levels)
  const group = useRef<Group>(null)

  const nodes = useMemo(
    () =>
      levelCatalog.map((item, index) => ({
        ...item,
        x: (index - 4.5) * 3.35,
        y: 0.55 + Math.sin(index * 0.9) * 0.2,
        z: -10 - Math.abs(index - 4.5) * 0.35,
        locked: item.id > unlocked,
        starCount: stars[String(item.id)]?.stars ?? 0,
      })),
    [stars, unlocked],
  )

  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.04
  })

  return (
    <>
      <HubCamera />
      <color attach="background" args={['#bfe8f5']} />
      <fog attach="fog" args={['#bfe8f5', 18, 70]} />
      <hemisphereLight args={['#dff6ff', '#3cbf7a', 0.9]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 18, 8]} intensity={1.3} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, -6]}>
        <circleGeometry args={[28, 32]} />
        <meshBasicMaterial color="#3cbf7a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.38, -6]}>
        <circleGeometry args={[7.5, 32]} />
        <meshBasicMaterial color="#d9c2a0" />
      </mesh>
      <group position={[0, 0, -1.5]}>
        <PlayerVisual cosmetics={cosmetics} />
      </group>
      <group ref={group}>
        {nodes.map((node) => (
          <HubNode key={node.id} node={node} selected={selected === node.id} />
        ))}
      </group>
      <WorldLabel text="WORD BRIDGE 3D" position={[0, 4.4, -8]} width={12} />
    </>
  )
}

function HubNode({
  node,
  selected,
}: {
  node: {
    id: number
    hubLabel: string
    world: keyof typeof palettes
    x: number
    y: number
    z: number
    locked: boolean
    starCount: number
  }
  selected: boolean
}) {
  const color = palettes[node.world].accent
  return (
    <group
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
        <cylinderGeometry args={[1.15, 1.25, 0.45, 8]} />
        <meshLambertMaterial color={node.locked ? '#6b7280' : color} />
      </mesh>
      <WorldLabel
        text={node.locked ? 'X' : String(node.id).padStart(2, '0')}
        position={[0, 1.2, 0]}
        width={1.8}
      />
      {selected && !node.locked && (
        <mesh position={[0, 0.05, 0]}>
          <torusGeometry args={[1.45, 0.06, 8, 20]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
      {!node.locked && (
        <WorldLabel
          text={`${'★'.repeat(node.starCount)}${'☆'.repeat(Math.max(0, 5 - node.starCount))}`}
          position={[0, 0.62, 0.85]}
          width={2.4}
          color="#ffd166"
        />
      )}
    </group>
  )
}
