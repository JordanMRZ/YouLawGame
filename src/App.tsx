import { Canvas } from '@react-three/fiber'
import { lazy, Suspense } from 'react'
import { Color } from 'three'
import { HubWorld } from './scenes/HubWorld'
import { useGameStore } from './store/gameStore'
import { Overlay } from './ui/Overlay'

const GameSession = lazy(async () => {
  const mod = await import('./scenes/GameSession')
  return { default: mod.GameSession }
})

export default function App() {
  const phase = useGameStore((s) => s.phase)
  const inHub = phase === 'hub'

  return (
    <div className="app-shell">
      <Canvas
        key={inHub ? 'hub' : 'game'}
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 6, 12], fov: 50, near: 0.1, far: 240 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        onCreated={({ scene, gl }) => {
          scene.background = new Color('#b8e0ef')
          gl.setClearColor('#b8e0ef')
        }}
      >
        <Suspense fallback={null}>{inHub ? <HubWorld /> : <GameSession />}</Suspense>
      </Canvas>
      <Overlay />
    </div>
  )
}
