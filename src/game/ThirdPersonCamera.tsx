import { useRapier } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { playerRuntime } from './runtime'

const _ideal = new Vector3()
const _look = new Vector3()
const _target = new Vector3()

export function ThirdPersonCamera() {
  const { camera } = useThree()
  const { world, rapier } = useRapier()
  const distance = useRef(8.6)

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      distance.current = Math.min(12.8, Math.max(5.6, distance.current + event.deltaY * 0.007))
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  useFrame((_, dt) => {
    if (!playerRuntime.ready) return
    const p = playerRuntime.position
    const yaw = playerRuntime.yaw
    playerRuntime.camYaw = yaw
    const dist = distance.current
    _ideal.set(p.x - Math.sin(yaw) * 1.4, p.y + 4.05, p.z - dist)
    const ox = p.x
    const oy = p.y + 1.35
    const oz = p.z
    const dx = _ideal.x - ox
    const dy = _ideal.y - oy
    const dz = _ideal.z - oz
    const len = Math.hypot(dx, dy, dz) || 1
    const nx = dx / len
    const ny = dy / len
    const nz = dz / len
    const ray = new rapier.Ray({ x: ox, y: oy, z: oz }, { x: nx, y: ny, z: nz })
    const hit = world.castRay(ray, len, true, undefined, undefined, undefined, undefined, (collider) => {
      if (collider.isSensor()) return false
      const parent = collider.parent()
      const data = parent?.userData as { player?: boolean } | undefined
      return !data?.player
    })
    _target.copy(_ideal)
    if (hit && hit.timeOfImpact < len - 0.35 && ny > -0.15) {
      const toi = Math.max(2.1, hit.timeOfImpact - 0.5)
      _target.set(ox + nx * toi, oy + ny * toi, oz + nz * toi)
    }
    _target.y = Math.max(_target.y, p.y + 2.8, 3.2)
    const smooth = 1 - Math.pow(0.018, dt)
    camera.position.lerp(_target, smooth)
    _look.set(p.x + Math.sin(yaw) * 1.2, Math.max(p.y + 1.62, 1.2), p.z + 6.2)
    camera.lookAt(_look)
  })

  return null
}
