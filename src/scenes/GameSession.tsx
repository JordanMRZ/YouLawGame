import { Physics } from '@react-three/rapier'
import { useMemo } from 'react'
import { getLevel } from '../data/levels'
import { LevelWorld } from '../game/LevelWorld'
import { ThirdPersonCamera } from '../game/ThirdPersonCamera'
import { Player } from '../player/Player'
import { useGameStore } from '../store/gameStore'

export function GameSession() {
  const levelId = useGameStore((s) => s.levelId)
  const sessionId = useGameStore((s) => s.sessionId)
  const paused = useGameStore(
    (s) =>
      s.phase === 'paused' ||
      s.phase === 'intro' ||
      s.phase === 'tutorial' ||
      s.phase === 'countdown' ||
      Boolean(s.mistake),
  )
  const level = useMemo(() => getLevel(levelId), [levelId, sessionId])

  return (
    <Physics key={`${levelId}-${sessionId}`} gravity={[0, -26, 0]} interpolate paused={paused} timeStep="vary">
      <LevelWorld level={level} />
      <Player level={level} />
      <ThirdPersonCamera />
    </Physics>
  )
}
