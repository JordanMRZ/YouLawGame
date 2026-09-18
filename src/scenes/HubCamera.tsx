import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'

const hubPos = new Vector3(0, 12.5, 25)
const hubLook = new Vector3(0, 0.2, -5)
const shopPos = new Vector3(-0.42, 1.12, 1.88)
const shopLook = new Vector3(0.06, 0.9, -1.5)
const pos = new Vector3()
const look = new Vector3()

export function HubCamera({ selectedWorld }: { selectedWorld: number | null }) {
  const shopOpen = useGameStore((s) => s.shopOpen)
  useFrame(({ camera }) => {
    if (shopOpen) {
      pos.copy(shopPos)
      look.copy(shopLook)
    } else if (selectedWorld !== null) {
      const angle = (selectedWorld / 10) * Math.PI * 2 - Math.PI * 0.5
      const centerX = Math.cos(angle) * 14
      const centerZ = -5.2 + Math.sin(angle) * 14
      pos.set(centerX, 8.2, centerZ + 8.2)
      look.set(centerX, 0.2, centerZ)
    } else {
      pos.copy(hubPos)
      look.copy(hubLook)
    }
    camera.position.lerp(pos, 0.08)
    camera.lookAt(look)
  })
  return null
}
