import { Vector3 } from 'three'
import type { AnimState, Vec3 } from '../data/types'

export const playerRuntime = {
  position: new Vector3(),
  velocity: new Vector3(),
  yaw: 0,
  camYaw: 0,
  grounded: false,
  anim: 'idle' as AnimState,
  ready: false,
  invulnerableUntil: 0,
  platformVelocity: new Vector3(),
  respawn: () => {},
  applyImpulse: (_x: number, _y: number, _z: number) => {},
  bounce: (_strength: number) => {},
}

export function vec3(v: Vec3) {
  return { x: v[0], y: v[1], z: v[2] }
}
