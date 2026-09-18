import { Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, type ReactNode } from 'react'
import type { Group } from 'three'
import { WorldLabel } from '../components/WorldLabel'
import type {
  ChallengeDef,
  CheckpointDef,
  CoinDef,
  MotionDef,
  ObstacleDef,
  PlatformDef,
  Vec3,
} from '../data/types'
import { PlayerVisual } from '../player/PlayerVisual'
import { useGameStore } from '../store/gameStore'
import { selectionKey, useEditorStore } from '../store/editorStore'

export function Selectable({
  selected: _selected,
  onSelect,
  children,
}: {
  selected: boolean
  onSelect: () => void
  children: ReactNode
}) {
  return (
    <group
      onClick={(event) => {
        event.stopPropagation()
        if (event.delta > 4) return
        onSelect()
      }}
    >
      {children}
    </group>
  )
}

function MotionRoot({
  position,
  motion,
  rotationSpeed = 0,
  preview,
  children,
}: {
  position: Vec3
  motion?: MotionDef | ObstacleDef['motion']
  rotationSpeed?: number
  preview: boolean
  children: ReactNode
}) {
  const group = useRef<Group>(null)
  useFrame((state) => {
    const node = group.current
    if (!node) return
    let x = position[0]
    let y = position[1]
    let z = position[2]
    if (preview && motion) {
      const off = Math.sin(state.clock.elapsedTime * (motion.speed ?? 1) + (motion.phase ?? 0)) * motion.amplitude
      if (motion.axis === 'x') x += off
      else if (motion.axis === 'y') y += off
      else z += off
    }
    node.position.set(x, y, z)
    node.rotation.y = preview && rotationSpeed ? state.clock.elapsedTime * rotationSpeed : 0
  })
  return (
    <group ref={group} position={position}>
      {children}
    </group>
  )
}

export function EditorPlatform({
  def,
  accent,
  selected,
  preview,
}: {
  def: PlatformDef
  accent: string
  selected: boolean
  preview: boolean
}) {
  const kind = def.kind ?? 'static'
  const color = def.color ?? (kind === 'recovery' ? '#7ec8e3' : accent)
  const [w, h, d] = def.size
  return (
    <MotionRoot
      position={def.position}
      motion={def.motion}
      rotationSpeed={kind === 'rotating' ? def.rotationSpeed ?? 0.8 : 0}
      preview={preview}
    >
      <Selectable selected={selected} onSelect={() => useEditorStore.getState().select({ kind: 'platform', id: def.id })}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshLambertMaterial color={color} transparent={kind === 'recovery'} opacity={kind === 'recovery' ? 0.45 : 1} />
        </mesh>
        {kind !== 'recovery' && (
          <>
            <mesh position={[0, h * 0.52, 0]} receiveShadow>
              <boxGeometry args={[w * 0.96, 0.06, d * 0.96]} />
              <meshLambertMaterial color={kind === 'bounce' ? '#b8ffd9' : '#ffffff'} />
            </mesh>
            <PlatformFeet w={w} h={h} d={d} />
          </>
        )}
        {kind === 'vanishing' && (
          <group position={[0, h / 2 + 0.12, 0]}>
            <mesh castShadow>
              <coneGeometry args={[w * 0.12, h * 0.24, 3]} />
              <meshStandardMaterial color="#ffd166" emissive="#ffb703" emissiveIntensity={0.4} />
            </mesh>
          </group>
        )}
        {selected && <SelectionBox size={def.size} />}
      </Selectable>
    </MotionRoot>
  )
}

export function EditorChallenge({
  challenge,
  selectedKey,
  index,
}: {
  challenge: ChallengeDef
  selectedKey: string
  index: number
}) {
  const size = challenge.platformSize ?? [4.5, 0.72, 4.6]
  const selectedHere =
    selectedKey === selectionKey({ kind: 'challenge', id: challenge.id }) ||
    selectedKey.startsWith(`option:${challenge.id}:`)
  return (
    <group>
      <group
        position={challenge.origin}
        onClick={(event) => {
          event.stopPropagation()
          if (event.delta > 4) return
          useEditorStore.getState().select({ kind: 'challenge', id: challenge.id })
        }}
      >
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 2.2, 8]} />
          <meshLambertMaterial color="#c9a227" />
        </mesh>
        <mesh position={[0, 2.28, 0]}>
          <boxGeometry args={[1.6, 0.7, 0.12]} />
          <meshLambertMaterial color={selectedHere ? '#ffd166' : '#e76f51'} />
        </mesh>
        <WorldLabel text={`P${index + 1}`} position={[0, 2.3, 0.12]} width={2.2} color="#102030" outline="#ffd166" />
        <WorldLabel
          text={challenge.sentence ?? 'Pregunta'}
          position={[0, 3.15, 0]}
          width={Math.min(16, 7 + (challenge.sentence?.length ?? 0) * 0.14)}
          color="#fff6d8"
        />
      </group>
      {challenge.options.map((option, optionIndex) => {
        const correct = option.word === challenge.correctAnswer
        const selected = selectedKey === selectionKey({ kind: 'option', id: challenge.id, optionIndex })
        const body = selected ? '#3d6d9a' : correct ? '#1f6f4a' : '#2c4c6e'
        const top = selected ? '#fff1b8' : correct ? '#b8ffd9' : '#f4fbff'
        return (
          <group
            key={`${challenge.id}-${optionIndex}`}
            position={[
              challenge.origin[0] + option.offset[0],
              challenge.origin[1] + option.offset[1],
              challenge.origin[2] + option.offset[2],
            ]}
            onClick={(event) => {
              event.stopPropagation()
              if (event.delta > 4) return
              useEditorStore.getState().select({ kind: 'option', id: challenge.id, optionIndex })
            }}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={size} />
              <meshLambertMaterial color={body} />
            </mesh>
            <mesh position={[0, size[1] * 0.52, 0]} receiveShadow>
              <boxGeometry args={[size[0] * 0.96, 0.07, size[2] * 0.96]} />
              <meshLambertMaterial color={top} />
            </mesh>
            <PlatformFeet w={size[0]} h={size[1]} d={size[2]} />
            <WorldLabel
              text={option.word}
              position={[0, size[1] * 0.5 + 1.05, 0]}
              width={option.word.length > 10 ? 5.6 : 4.2}
              color={correct ? '#b8ffd9' : '#ffffff'}
            />
            {correct && <WorldLabel text="CORRECTA" position={[0, size[1] * 0.5 + 1.55, 0]} width={3.2} color="#b8ffd9" />}
            {selected && <SelectionBox size={size} />}
          </group>
        )
      })}
    </group>
  )
}

export function EditorObstacle({
  def,
  selected,
  preview,
}: {
  def: ObstacleDef
  selected: boolean
  preview: boolean
}) {
  return (
    <MotionRoot position={def.position} motion={def.motion} preview={preview}>
      <Selectable selected={selected} onSelect={() => useEditorStore.getState().select({ kind: 'obstacle', id: def.id })}>
        {def.kind === 'barrier' ? (
          <BarrierVisual def={def} />
        ) : def.kind === 'hammer' ? (
          <HammerVisual def={def} preview={preview} />
        ) : def.kind === 'fan' ? (
          <FanVisual def={def} preview={preview} />
        ) : def.kind === 'spinner' ? (
          <SpinnerVisual def={def} preview={preview} />
        ) : (
          <mesh castShadow>
            <boxGeometry args={def.size ?? [1.6, 1.6, 1.6]} />
            <meshLambertMaterial color="#bc6c25" />
          </mesh>
        )}
        {selected && <SelectionBox size={def.size ?? sizeForObstacle(def)} />}
      </Selectable>
    </MotionRoot>
  )
}

function BarrierVisual({ def }: { def: ObstacleDef }) {
  const size = def.size ?? [2.2, 1, 0.7]
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshLambertMaterial color={def.color ?? '#d64545'} />
      </mesh>
      <mesh position={[0, size[1] * 0.52, 0]}>
        <boxGeometry args={[size[0], 0.08, size[2] + 0.08]} />
        <meshLambertMaterial color="#ffd166" />
      </mesh>
    </group>
  )
}

function HammerVisual({ def, preview }: { def: ObstacleDef; preview: boolean }) {
  const arm = useRef<Group>(null)
  const speed = def.speed ?? 1.1
  useFrame((state) => {
    if (!arm.current) return
    arm.current.rotation.x = preview ? Math.sin(state.clock.elapsedTime * speed) * 1.25 : -0.4
  })
  return (
    <group ref={arm}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshLambertMaterial color="#6c584c" />
      </mesh>
      <mesh position={[0, -1.15, 0]} castShadow>
        <boxGeometry args={[1.4, 0.7, 0.7]} />
        <meshLambertMaterial color="#bc4749" />
      </mesh>
    </group>
  )
}

function FanVisual({ def, preview }: { def: ObstacleDef; preview: boolean }) {
  const blades = useRef<Group>(null)
  const speed = def.speed ?? 1
  useFrame((state) => {
    if (!blades.current) return
    blades.current.rotation.z = preview ? state.clock.elapsedTime * speed * 6 : 0.4
  })
  return (
    <group ref={blades}>
      <mesh>
        <boxGeometry args={[2.6, 0.12, 0.36]} />
        <meshLambertMaterial color="#4cc9f0" />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[2.6, 0.12, 0.36]} />
        <meshLambertMaterial color="#90e0ef" />
      </mesh>
    </group>
  )
}

function SpinnerVisual({ def, preview }: { def: ObstacleDef; preview: boolean }) {
  const bar = useRef<Group>(null)
  const speed = def.speed ?? 1.4
  useFrame((state) => {
    if (!bar.current) return
    bar.current.rotation.y = preview ? state.clock.elapsedTime * speed : 0.35
  })
  return (
    <group ref={bar}>
      <mesh castShadow>
        <boxGeometry args={[4.4, 0.28, 0.36]} />
        <meshLambertMaterial color="#e76f51" />
      </mesh>
    </group>
  )
}

export function EditorCoin({ def, selected }: { def: CoinDef; selected: boolean }) {
  const spin = useRef<Group>(null)
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 2.4
  })
  return (
    <group
      position={def.position}
      onClick={(event) => {
        event.stopPropagation()
        if (event.delta > 4) return
        useEditorStore.getState().select({ kind: 'coin', id: def.id })
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
      {selected && <SelectionBox size={[0.8, 0.8, 0.8]} />}
    </group>
  )
}

export function EditorCheckpoint({ def, selected }: { def: CheckpointDef; selected: boolean }) {
  const width = def.width ?? 12
  return (
    <group
      position={def.position}
      onClick={(event) => {
        event.stopPropagation()
        if (event.delta > 4) return
        useEditorStore.getState().select({ kind: 'checkpoint', id: def.id })
      }}
    >
      <mesh>
        <boxGeometry args={[Math.min(width - 1, 12), 3.2, 0.6]} />
        <meshLambertMaterial color="#3ee0b3" transparent opacity={0.18} />
      </mesh>
      <mesh position={[-(width * 0.38), 0.2, 0]}>
        <boxGeometry args={[0.28, 3.4, 0.28]} />
        <meshLambertMaterial color="#1f6f8b" />
      </mesh>
      <mesh position={[width * 0.38, 0.2, 0]}>
        <boxGeometry args={[0.28, 3.4, 0.28]} />
        <meshLambertMaterial color="#1f6f8b" />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[width * 0.72, 0.28, 0.28]} />
        <meshLambertMaterial color="#ffd166" />
      </mesh>
      <WorldLabel text="CHECKPOINT" position={[0, 2.2, 0.2]} width={5.2} color="#ffd166" />
      {selected && <SelectionBox size={[width, 3.4, 1.2]} />}
    </group>
  )
}

export function EditorGoal({
  position,
  size,
  selected,
}: {
  position: Vec3
  size?: Vec3
  selected: boolean
}) {
  return (
    <group
      position={position}
      onClick={(event) => {
        event.stopPropagation()
        if (event.delta > 4) return
        useEditorStore.getState().select({ kind: 'goal', id: 'goal' })
      }}
    >
      <mesh>
        <boxGeometry args={[8, 4.2, 1.2]} />
        <meshLambertMaterial color="#ffd166" transparent opacity={0.16} />
      </mesh>
      <mesh position={[-3.8, 0.4, 0]} castShadow>
        <boxGeometry args={[0.5, 4.4, 0.5]} />
        <meshLambertMaterial color="#f4a261" />
      </mesh>
      <mesh position={[3.8, 0.4, 0]} castShadow>
        <boxGeometry args={[0.5, 4.4, 0.5]} />
        <meshLambertMaterial color="#f4a261" />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[8.2, 0.7, 0.6]} />
        <meshLambertMaterial color="#e76f51" />
      </mesh>
      <WorldLabel text="GOAL" position={[0, 2.6, 0.45]} width={4.4} color="#fff7e6" />
      <Sparkles count={18} scale={[6, 3, 2]} size={4} speed={0.4} color="#ffd166" />
      {selected && <SelectionBox size={size ?? [8, 4.4, 1.4]} />}
    </group>
  )
}

export function EditorStart({ position, selected }: { position: Vec3; selected: boolean }) {
  const cosmetics = useGameStore((s) => s.save.cosmetics)
  return (
    <group
      position={position}
      onClick={(event) => {
        event.stopPropagation()
        if (event.delta > 4) return
        useEditorStore.getState().select({ kind: 'start', id: 'start' })
      }}
    >
      <PlayerVisual cosmetics={cosmetics} pose="idle" />
      <WorldLabel text="INICIO" position={[0, 2.45, 0]} width={3.4} color="#9ae6ff" />
      {selected && <SelectionBox size={[1.4, 2.2, 1.4]} />}
    </group>
  )
}

function PlatformFeet({ w, h, d }: { w: number; h: number; d: number }) {
  const ox = Math.max(0.28, w * 0.42)
  const oz = Math.max(0.28, d * 0.42)
  const y = -h / 2 - 0.18
  const spots: Vec3[] = [
    [-ox, y, -oz],
    [ox, y, -oz],
    [-ox, y, oz],
    [ox, y, oz],
  ]
  return (
    <>
      {spots.map((spot, i) => (
        <mesh key={i} position={spot} castShadow>
          <cylinderGeometry args={[0.14, 0.18, 0.36, 8]} />
          <meshLambertMaterial color="#d9c2a0" />
        </mesh>
      ))}
    </>
  )
}

function SelectionBox({ size }: { size: Vec3 }) {
  return (
    <mesh>
      <boxGeometry args={[size[0] + 0.16, size[1] + 0.16, size[2] + 0.16]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.75} />
    </mesh>
  )
}

function sizeForObstacle(def: ObstacleDef): Vec3 {
  if (def.kind === 'barrier') return def.size ?? [4, 2, 0.85]
  if (def.kind === 'fan') return [2.6, 2.2, 2.6]
  if (def.kind === 'hammer') return [1.4, 3.2, 1.4]
  if (def.kind === 'spinner') return [4.4, 0.5, 4.4]
  return def.size ?? [1.6, 1.6, 1.6]
}

export function MotionGhost({ position, motion }: { position: Vec3; motion: MotionDef | NonNullable<ObstacleDef['motion']> }) {
  const amp = motion.amplitude
  const size: Vec3 =
    motion.axis === 'x' ? [amp * 2, 0.08, 0.08] : motion.axis === 'y' ? [0.08, amp * 2, 0.08] : [0.08, 0.08, amp * 2]
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
    </mesh>
  )
}
