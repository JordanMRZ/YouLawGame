import { create } from 'zustand'
import { audio } from '../audio/audioManager'
import { getLevel, unloadLevel } from '../data/levels'
import { loadSave, persistSave } from '../data/storage'
import type { Cosmetics, GamePhase, RunResults, SaveData, Vec3 } from '../data/types'
import { explainMistake, type MissReason } from '../game/explain'
import { playerRuntime } from '../game/runtime'
import { computeResults } from '../game/scoring'

interface GameState {
  phase: GamePhase
  selectedLevel: number
  levelId: number
  sessionId: number
  lives: number
  streak: number
  bestStreak: number
  correct: number
  mistakes: number
  coins: number
  elapsed: number
  prompt: string | null
  toast: string | null
  xpPopup: string | null
  lastCheckpoint: Vec3
  minZ: number
  answered: Record<string, 'correct' | 'wrong'>
  tried: Record<string, string[]>
  activeChallengeId: string | null
  challengeTimeLeft: number
  mistake: {
    challengeId: string
    chosen: string
    reason: MissReason
    text: string
    lastLife: boolean
  } | null
  lastExplanation: string | null
  results: RunResults | null
  save: SaveData
  customizeOpen: boolean
  settingsOpen: boolean
  burst: { at: Vec3; kind: 'correct' | 'wrong' | 'checkpoint' | 'goal' | 'coin' } | null
  startLevel: (id: number) => void
  backToHub: () => void
  setPhase: (phase: GamePhase) => void
  setSelectedLevel: (id: number) => void
  tick: (dt: number) => void
  setPrompt: (prompt: string | null) => void
  showToast: (text: string) => void
  collectCoin: (id: string) => void
  answer: (challengeId: string, word: string, correct: boolean) => 'correct' | 'wrong' | 'ignored'
  missChallenge: (challengeId: string, reason: Exclude<MissReason, 'wrong'>) => void
  dismissMistake: () => void
  setActiveChallenge: (id: string | null) => void
  tickChallenge: (dt: number) => void
  loseLife: (reason: 'fall' | 'wrong') => boolean
  setCheckpoint: (position: Vec3) => void
  setMinZ: (z: number) => void
  uncomplete: (challengeId: string) => void
  finishLevel: () => void
  failLevel: () => void
  updateSettings: (patch: Partial<SaveData['settings']>) => void
  updateCosmetics: (patch: Partial<Cosmetics>) => void
  setCustomizeOpen: (open: boolean) => void
  setSettingsOpen: (open: boolean) => void
  spawnBurst: (kind: 'correct' | 'wrong' | 'checkpoint' | 'goal' | 'coin', at: Vec3) => void
  clearBurst: () => void
}

const initialSave = loadSave()
audio.configure(initialSave.settings)

let toastTimer: number | null = null
let popupTimer: number | null = null

function persist(save: SaveData) {
  persistSave(save)
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'hub',
  selectedLevel: Math.min(initialSave.unlockedLevel, 10),
  levelId: 1,
  sessionId: 0,
  lives: 3,
  streak: 0,
  bestStreak: 0,
  correct: 0,
  mistakes: 0,
  coins: 0,
  elapsed: 0,
  prompt: null,
  toast: null,
  xpPopup: null,
  lastCheckpoint: [0, 2.2, 2],
  minZ: -20,
  answered: {},
  tried: {},
  activeChallengeId: null,
  challengeTimeLeft: 0,
  mistake: null,
  lastExplanation: null,
  results: null,
  save: initialSave,
  customizeOpen: false,
  settingsOpen: false,
  burst: null,

  startLevel: (id) => {
    unloadLevel(id)
    const level = getLevel(id)
    audio.unlock()
    audio.stopSpeech()
    set({
      sessionId: get().sessionId + 1,
      phase: 'intro',
      levelId: id,
      lives: 3,
      streak: 0,
      bestStreak: 0,
      correct: 0,
      mistakes: 0,
      coins: 0,
      elapsed: 0,
      prompt: null,
      toast: null,
      xpPopup: null,
      lastCheckpoint: level.start,
      minZ: level.start[2] - 4,
      answered: {},
      tried: {},
      activeChallengeId: null,
      challengeTimeLeft: 0,
      mistake: null,
      lastExplanation: null,
      results: null,
      burst: null,
      customizeOpen: false,
      settingsOpen: false,
    })
  },

  backToHub: () => {
    audio.stopSpeech()
    set({
      phase: 'hub',
      prompt: null,
      toast: null,
      results: null,
      mistake: null,
      burst: null,
    })
  },

  setPhase: (phase) => set({ phase }),
  setSelectedLevel: (id) => set({ selectedLevel: id }),

  tick: (dt) => {
    if (get().phase !== 'play' || get().mistake) return
    set({ elapsed: get().elapsed + dt })
  },

  setPrompt: (prompt) => set({ prompt }),

  showToast: (text) => {
    set({ toast: text })
    if (toastTimer) window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => set({ toast: null }), 1400)
  },

  collectCoin: (id) => {
    const key = `coin-${id}`
    if (get().answered[key]) return
    audio.play('coin')
    set({
      coins: get().coins + 1,
      answered: { ...get().answered, [key]: 'correct' },
      xpPopup: '+25 XP',
    })
    if (popupTimer) window.clearTimeout(popupTimer)
    popupTimer = window.setTimeout(() => set({ xpPopup: null }), 700)
  },

  answer: (challengeId, word, correct) => {
    const state = get()
    if (state.phase !== 'play' || state.mistake) return 'ignored'
    if (state.answered[challengeId] === 'correct') return 'ignored'
    if ((state.tried[challengeId] ?? []).includes(word)) return 'ignored'
    const level = getLevel(state.levelId)
    const challenge = level.challenges.find((item) => item.id === challengeId)
    if (!challenge) return 'ignored'

    if (correct) {
      const streak = state.streak + 1
      audio.play('correct')
      set({
        answered: { ...state.answered, [challengeId]: 'correct' },
        correct: state.correct + 1,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        xpPopup: streak >= 2 ? `STREAK x${streak}` : '+80 XP',
        challengeTimeLeft: 0,
      })
      if (popupTimer) window.clearTimeout(popupTimer)
      popupTimer = window.setTimeout(() => set({ xpPopup: null }), 900)
      return 'correct'
    }

    const tried = { ...state.tried, [challengeId]: [...(state.tried[challengeId] ?? []), word] }
    audio.play('wrong')
    const lives = state.lives - 1
    const text = explainMistake(challenge, word, 'wrong')
    set({
      tried,
      mistakes: state.mistakes + 1,
      streak: 0,
      lives,
      mistake: { challengeId, chosen: word, reason: 'wrong', text, lastLife: lives <= 0 },
      lastExplanation: text,
      challengeTimeLeft: 0,
    })
    return 'wrong'
  },

  missChallenge: (challengeId, reason) => {
    const state = get()
    if (state.phase !== 'play' || state.mistake) return
    if (state.answered[challengeId] === 'correct') return
    const level = getLevel(state.levelId)
    const challenge = level.challenges.find((item) => item.id === challengeId)
    if (!challenge) return
    audio.play('wrong')
    const lives = state.lives - 1
    const text = explainMistake(challenge, challenge.correctAnswer, reason)
    set({
      mistakes: state.mistakes + 1,
      streak: 0,
      lives,
      mistake: { challengeId, chosen: reason === 'timeout' ? 'TIME' : 'PASSED', reason, text, lastLife: lives <= 0 },
      lastExplanation: text,
      challengeTimeLeft: 0,
    })
  },

  dismissMistake: () => {
    const state = get()
    if (!state.mistake) return
    if (state.lives <= 0) {
      get().failLevel()
      return
    }
    const level = getLevel(state.levelId)
    const challenge = level.challenges.find((item) => item.id === state.activeChallengeId)
    set({
      mistake: null,
      challengeTimeLeft: challenge?.timeLimit ?? 15,
    })
    playerRuntime.respawn()
  },

  setActiveChallenge: (id) => {
    if (id === get().activeChallengeId) return
    if (!id) {
      set({ activeChallengeId: null, challengeTimeLeft: 0 })
      return
    }
    const level = getLevel(get().levelId)
    const challenge = level.challenges.find((item) => item.id === id)
    const already = get().answered[id] === 'correct'
    set({
      activeChallengeId: id,
      challengeTimeLeft: already ? 0 : (challenge?.timeLimit ?? 15),
    })
  },

  tickChallenge: (dt) => {
    const state = get()
    if (state.phase !== 'play' || state.mistake) return
    if (!state.activeChallengeId || state.challengeTimeLeft <= 0) return
    if (state.answered[state.activeChallengeId] === 'correct') return
    const left = state.challengeTimeLeft - dt
    if (left <= 0) {
      set({ challengeTimeLeft: 0 })
      get().missChallenge(state.activeChallengeId, 'timeout')
      return
    }
    set({ challengeTimeLeft: left })
  },

  loseLife: (reason) => {
    if (get().phase !== 'play') return true
    const lives = get().lives - 1
    if (reason === 'fall') audio.play('fall')
    set({ lives })
    if (lives <= 0) {
      get().failLevel()
      return false
    }
    return true
  },

  setCheckpoint: (position) => {
    set({
      lastCheckpoint: position,
      minZ: Math.max(get().minZ, position[2] - 0.35),
    })
    audio.play('checkpoint')
    get().showToast('CHECKPOINT!')
  },

  setMinZ: (z) => {
    if (z <= get().minZ) return
    set({ minZ: z })
  },

  uncomplete: (challengeId) => {
    const current = get().answered[challengeId]
    if (current !== 'correct') return
    const next = { ...get().answered }
    delete next[challengeId]
    set({
      answered: next,
      correct: Math.max(0, get().correct - 1),
      streak: 0,
    })
  },

  finishLevel: () => {
    const state = get()
    if (state.phase === 'results' || state.phase === 'credits') return
    const level = getLevel(state.levelId)
    const results = computeResults({
      correct: state.correct,
      mistakes: state.mistakes,
      time: state.elapsed,
      parTime: level.parTime,
      bestStreak: state.bestStreak,
      coins: state.coins,
    })
    audio.play('complete')
    const save = { ...state.save }
    const key = String(state.levelId)
    const prev = save.levels[key]
    save.xp += results.xp
    save.levels[key] = {
      stars: Math.max(prev?.stars ?? 0, results.stars),
      bestTime: prev ? Math.min(prev.bestTime, results.time) : results.time,
      bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, results.accuracy),
      completed: true,
    }
    if (state.levelId >= save.unlockedLevel && state.levelId < 10) {
      save.unlockedLevel = state.levelId + 1
    }
    save.totals = {
      time: save.totals.time + results.time,
      mistakes: save.totals.mistakes + results.mistakes,
      bestStreak: Math.max(save.totals.bestStreak, results.bestStreak),
      stars: Object.values(save.levels).reduce((sum, record) => sum + record.stars, 0),
    }
    persist(save)
    set({
      save,
      results,
      phase: state.levelId === 10 ? 'credits' : 'results',
      prompt: null,
    })
  },

  failLevel: () => {
    audio.play('fail')
    set({ phase: 'failed', prompt: null, mistake: null, challengeTimeLeft: 0 })
  },

  updateSettings: (patch) => {
    const save = {
      ...get().save,
      settings: { ...get().save.settings, ...patch },
    }
    persist(save)
    audio.configure(save.settings)
    set({ save })
  },

  updateCosmetics: (patch) => {
    const save = {
      ...get().save,
      cosmetics: { ...get().save.cosmetics, ...patch },
    }
    persist(save)
    set({ save })
  },

  setCustomizeOpen: (open) => set({ customizeOpen: open }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),

  spawnBurst: (kind, at) => set({ burst: { kind, at } }),
  clearBurst: () => set({ burst: null }),
}))
