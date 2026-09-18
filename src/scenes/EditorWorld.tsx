import { Grid, OrbitControls, TransformControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef, type ComponentRef, type RefObject } from 'react'
import type { Group } from 'three'
import type { Vec3 } from '../data/types'
import {
  canScale,
  editorCursor,
  getSelectedPose,
  selectionKey,
  useEditorStore,
} from '../store/editorStore'
import { LevelEnvironment } from '../components/environment/LevelEnvironment'
import {
  EditorChallenge,
  EditorCheckpoint,
  EditorCoin,
  EditorGoal,
  EditorObstacle,
  EditorPlatform,
  EditorStart,
  MotionGhost,
} from './editorVisuals'

type OrbitControlsHandle = ComponentRef<typeof OrbitControls>

export function EditorWorld() {
  const draft = useEditorStore((s) => s.draft)
  const selected = useEditorStore((s) => s.selected)
  const previewMotion = useEditorStore((s) => s.previewMotion)
  const orbitRef = useRef<OrbitControlsHandle>(null)
  const camera = useThree((state) => state.camera)
  const focusToken = useEditorStore((s) => s.focusToken)
  const booted = useRef(false)
  const lastFocus = useRef(0)
  const draftId = draft?.id

  useLayoutEffect(() => {
    booted.current = false
    lastFocus.current = 0
  }, [draftId])

  useFrame(() => {
    const orbit = orbitRef.current
    if (orbit) editorCursor.current = [orbit.target.x, orbit.target.y, orbit.target.z]
    const current = useEditorStore.getState().draft
    if (!current || !orbit) return
    if (!booted.current) {
      booted.current = true
      const start = current.start
      camera.position.set(start[0] + 14, start[1] + 12, start[2] - 10)
      orbit.target.set(start[0], start[1], start[2] + 6)
      orbit.update()
      editorCursor.current = [start[0], start[1], start[2] + 6]
    }
    if (focusToken !== lastFocus.current) {
      lastFocus.current = focusToken
      const sel = useEditorStore.getState().selected
      const pose = sel ? getSelectedPose(current, sel) : { position: current.start, size: [1, 1, 1] as Vec3 }
      if (!pose) return
      camera.position.set(pose.position[0] + 10, pose.position[1] + 8, pose.position[2] - 12)
      orbit.target.set(pose.position[0], pose.position[1], pose.position[2])
      orbit.update()
    }
  })

  if (!draft) return null
  const selKey = selectionKey(selected)
  const accent = draft.palette.accent

  return (
    <>
      <LevelEnvironment level={draft} />
      <Grid
        args={[220, 220]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#7aa8b8"
        sectionSize={5}
        sectionThickness={1.1}
        sectionColor="#4d7a8a"
        fadeDistance={90}
        fadeStrength={1}
        position={[0, -0.42, 0]}
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.44, 0]}
        onClick={(event) => {
          if (event.delta > 3) return
          useEditorStore.getState().select(null)
        }}
      >
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {draft.platforms.map((platform) => (
        <EditorPlatform
          key={platform.id}
          def={platform}
          accent={accent}
          selected={selKey === selectionKey({ kind: 'platform', id: platform.id })}
          preview={previewMotion}
        />
      ))}
      {draft.challenges.map((challenge, index) => (
        <EditorChallenge key={challenge.id} challenge={challenge} selectedKey={selKey} index={index} />
      ))}
      {draft.obstacles.map((obstacle) => (
        <EditorObstacle
          key={obstacle.id}
          def={obstacle}
          selected={selKey === selectionKey({ kind: 'obstacle', id: obstacle.id })}
          preview={previewMotion}
        />
      ))}
      {draft.coins.map((coin) => (
        <EditorCoin key={coin.id} def={coin} selected={selKey === selectionKey({ kind: 'coin', id: coin.id })} />
      ))}
      {draft.checkpoints.map((checkpoint) => (
        <EditorCheckpoint
          key={checkpoint.id}
          def={checkpoint}
          selected={selKey === selectionKey({ kind: 'checkpoint', id: checkpoint.id })}
        />
      ))}
      <EditorGoal
        position={draft.goal.position}
        size={draft.goal.size}
        selected={selKey === selectionKey({ kind: 'goal', id: 'goal' })}
      />
      <EditorStart position={draft.start} selected={selKey === selectionKey({ kind: 'start', id: 'start' })} />
      {previewMotion &&
        draft.platforms.map((platform) =>
          platform.motion ? <MotionGhost key={`g-${platform.id}`} position={platform.position} motion={platform.motion} /> : null,
        )}
      {previewMotion &&
        draft.obstacles.map((obstacle) =>
          obstacle.motion ? (
            <MotionGhost key={`og-${obstacle.id}`} position={obstacle.position} motion={obstacle.motion} />
          ) : null,
        )}
      <SelectedGizmo orbitRef={orbitRef} />
      <OrbitControls
        ref={orbitRef}
        makeDefault
        enableDamping
        dampingFactor={0.12}
        maxPolarAngle={Math.PI * 0.49}
        minDistance={3}
        maxDistance={160}
      />
    </>
  )
}

function SelectedGizmo({ orbitRef }: { orbitRef: RefObject<OrbitControlsHandle | null> }) {
  const selected = useEditorStore((s) => s.selected)
  const draft = useEditorStore((s) => s.draft)
  const tool = useEditorStore((s) => s.tool)
  const snap = useEditorStore((s) => s.snap)
  const groupRef = useRef<Group>(null)
  const baseSize = useRef<Vec3>([1, 1, 1])
  const selKey = selectionKey(selected)
  const pose = selected && draft ? getSelectedPose(draft, selected) : null

  useLayoutEffect(() => {
    if (!groupRef.current || !pose) return
    groupRef.current.position.set(pose.position[0], pose.position[1], pose.position[2])
    groupRef.current.scale.set(1, 1, 1)
    baseSize.current = pose.size
    const orbit = orbitRef.current
    return () => {
      if (orbit) orbit.enabled = true
    }
  }, [orbitRef, pose, selKey])

  if (!selected || !pose) return null
  const mode = tool === 'scale' && canScale(selected.kind) ? 'scale' : 'translate'

  return (
    <TransformControls
      key={`${selKey}-${mode}`}
      mode={mode}
      translationSnap={snap || undefined}
      scaleSnap={0.1}
      size={0.9}
      onMouseDown={() => {
        const orbit = orbitRef.current
        if (orbit) orbit.enabled = false
        useEditorStore.getState().beginUndo()
      }}
      onMouseUp={() => {
        const orbit = orbitRef.current
        if (orbit) orbit.enabled = true
        const node = groupRef.current
        if (!node) return
        const size: Vec3 = [
          Math.max(0.2, baseSize.current[0] * node.scale.x),
          Math.max(0.2, baseSize.current[1] * node.scale.y),
          Math.max(0.2, baseSize.current[2] * node.scale.z),
        ]
        node.scale.set(1, 1, 1)
        useEditorStore.getState().applyWorldTransform([node.position.x, node.position.y, node.position.z], size)
      }}
    >
      <group ref={groupRef} position={pose.position}>
        <mesh>
          <boxGeometry args={pose.size} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.2} />
        </mesh>
      </group>
    </TransformControls>
  )
}
