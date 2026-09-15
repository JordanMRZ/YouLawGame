import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'

const hubPos = new Vector3(0, 8.4, 16)
const hubLook = new Vector3(0, 0.4, -6)
const shopPos = new Vector3(-0.42, 1.12, 1.88)
const shopLook = new Vector3(0.06, 0.9, -1.5)
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
