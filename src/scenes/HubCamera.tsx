import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

const target = new Vector3(0, 6.6, 13)
const look = new Vector3(0, 1.1, -6)

export function HubCamera() {
  useFrame(({ camera }) => {
    camera.position.lerp(target, 0.06)
    camera.lookAt(look)
  })
  return null
}
