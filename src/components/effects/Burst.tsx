import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Color, InstancedMesh, Object3D } from 'three'
import { useGameStore } from '../../store/gameStore'

const dummy = new Object3D()

export function BurstFX() {
  const burst = useGameStore((s) => s.burst)
  const mesh = useRef<InstancedMesh>(null)
  const life = useRef(0)
  const seeds = useMemo(() => Array.from({ length: 18 }, () => ({ x: Math.random() * 2 - 1, y: Math.random(), z: Math.random() * 2 - 1 })), [burst])
  const color = burst?.kind === 'wrong' ? '#ff5d6c' : burst?.kind === 'checkpoint' ? '#3ee0b3' : '#ffd166'

  useEffect(() => {
    life.current = burst ? 0.7 : 0
  }, [burst])

  useFrame((_, dt) => {
    if (!mesh.current || !burst) return
    life.current -= dt
    if (life.current <= 0) {
      useGameStore.getState().clearBurst()
      return
    }
    const t = 1 - life.current / 0.7
    seeds.forEach((s, i) => {
      dummy.position.set(burst.at[0] + s.x * t * 1.8, burst.at[1] + s.y * t * 2.2, burst.at[2] + s.z * t * 1.8)
      dummy.scale.setScalar(0.22 * (1 - t))
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  if (!burst) return null
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 18]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={new Color(color)} />
    </instancedMesh>
  )
}
