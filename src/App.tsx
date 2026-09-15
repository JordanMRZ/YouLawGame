import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useRef, useState } from 'react'
import { Color } from 'three'
import { CanvasErrorBoundary } from './components/CanvasErrorBoundary'
import { GameSession } from './scenes/GameSession'
import { HubWorld } from './scenes/HubWorld'
import { useGameStore } from './store/gameStore'
import { Overlay } from './ui/Overlay'

export default function App() {
  const phase = useGameStore((s) => s.phase)
  const inHub = phase === 'hub'
  const [canvasKey, setCanvasKey] = useState(0)
  const recovering = useRef(false)

  const remountCanvas = useCallback(() => {
    if (recovering.current) return
    recovering.current = true
    setCanvasKey((value) => value + 1)
    window.setTimeout(() => {
      recovering.current = false
    }, 400)
  }, [])

  return (
    <div className="app-shell">
      <CanvasErrorBoundary onReset={remountCanvas}>
        <Canvas
          key={canvasKey}
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 6, 12], fov: 50, near: 0.1, far: 240 }}
          gl={{ antialias: true, powerPreference: 'default', alpha: false, failIfMajorPerformanceCaveat: false }}
          onCreated={({ scene, gl }) => {
            scene.background = new Color('#b8e0ef')
            gl.setClearColor('#b8e0ef')
            const canvas = gl.domElement
            const width = Math.max(1, canvas.clientWidth)
            const height = Math.max(1, canvas.clientHeight)
            gl.setSize(width, height, false)
            gl.setViewport(0, 0, width, height)
            gl.setScissor(0, 0, width, height)
            canvas.addEventListener('webglcontextlost', (event) => {
              event.preventDefault()
              remountCanvas()
            })
          }}
        >
          {inHub ? (
            <HubWorld />
          ) : (
            <Suspense fallback={null}>
              <GameSession />
            </Suspense>
          )}
        </Canvas>
      </CanvasErrorBoundary>
      <Overlay />
    </div>
  )
}
