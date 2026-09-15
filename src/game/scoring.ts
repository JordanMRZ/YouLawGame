import type { RunResults } from '../data/types'

export function formatTime(seconds: number) {
  const safe = Math.max(0, seconds)
  const m = Math.floor(safe / 60)
  const s = Math.floor(safe % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function computeResults(input: {
  correct: number
  mistakes: number
  time: number
  parTime: number
  bestStreak: number
  coins: number
}): RunResults {
  const attempts = input.correct + input.mistakes
  const accuracy = attempts === 0 ? 1 : input.correct / attempts
  const timeRatio = Math.max(0, Math.min(1, 1 - (input.time - input.parTime * 0.55) / (input.parTime * 1.35)))
  const base = 420 + input.correct * 85
  const streakXP = input.bestStreak * 22
  const coinXP = input.coins * 28
  const timeXP = Math.round(timeRatio * 210)
  const mistakeCut = input.mistakes * 40
  const xp = Math.max(120, Math.round(base + streakXP + coinXP + timeXP - mistakeCut))

  let stars = 1
  if (accuracy >= 0.55 && input.mistakes <= 4) stars = 2
  if (accuracy >= 0.72 && input.mistakes <= 2) stars = 3
  if (accuracy >= 0.86 && input.mistakes <= 1) stars = 4
  if (accuracy >= 0.95 && input.mistakes === 0 && timeRatio >= 0.42) stars = 5

  return {
    accuracy,
    time: input.time,
    mistakes: input.mistakes,
    bestStreak: input.bestStreak,
    coins: input.coins,
    xp,
    stars,
    correct: input.correct,
  }
}
