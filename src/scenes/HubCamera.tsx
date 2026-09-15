import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'

const hubPos = new Vector3(0, 6.6, 13)
const hubLook = new Vector3(0, 1.1, -6)
const shopPos = new Vector3(0.15, 1.85, 3.4)
const shopLook = new Vector3(0, 0.95, -1.5)
const pos = new Vector3()
const look = new Vector3()

export function HubCamera() {
  const shopOpen = useGameStore((s) => s.shopOpen)
  useFrame(({ camera }) => {
    pos.copy(shopOpen ? shopPos : hubPos)
    look.copy(shopOpen ? shopLook : hubLook)
    camera.position.lerp(pos, 0.08)
    camera.lookAt(look)
  })
  return null
}
