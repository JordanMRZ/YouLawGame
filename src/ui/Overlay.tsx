import { useEffect, useState } from 'react'
import { audio } from '../audio/audioManager'
import { getLevel, levelCatalog } from '../data/levels'
import { formatTime } from '../game/scoring'
import { useGameStore } from '../store/gameStore'
import { ShopPanel } from './ShopPanel'
import { TutorialCard } from './TutorialCard'

export function Overlay() {
  const phase = useGameStore((s) => s.phase)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const state = useGameStore.getState()
      if (event.code === 'Escape') {
        if (state.mistake) return
        if (state.shopOpen) {
          state.setShopOpen(false)
          return
        }
        if (state.phase === 'play') state.setPhase('paused')
        else if (state.phase === 'paused') state.setPhase('play')
      }
      if (state.mistake && event.code === 'Enter') {
        event.preventDefault()
        state.dismissMistake()
        return
      }
      if (state.phase === 'tutorial' && (event.code === 'Enter' || event.code === 'Space')) {
        event.preventDefault()
        const next = state.tutorialStep + 1
        if (next >= 5) {
          audio.stopSpeech()
          state.setPhase('countdown')
        } else {
          state.setTutorialStep(next)
        }
        return
      }
      if (state.phase === 'hub') {
        if (state.shopOpen) return
        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
          const next = Math.min(10, state.selectedLevel + 1)
          if (next <= state.save.unlockedLevel) state.setSelectedLevel(next)
        }
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
          state.setSelectedLevel(Math.max(1, state.selectedLevel - 1))
        }
        if (event.code === 'Enter' || event.code === 'Space') {
          if (state.selectedLevel <= state.save.unlockedLevel) state.startLevel(state.selectedLevel)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="overlay">
      {phase === 'hub' && <HubChrome />}
      {phase !== 'hub' && phase !== 'intro' && phase !== 'tutorial' && <HUD />}
      {phase === 'tutorial' && <TutorialCard />}
      {phase === 'intro' && <IntroCard />}
      {phase === 'countdown' && <Countdown />}
      {phase === 'paused' && <PauseCard />}
      {phase === 'results' && <ResultsCard />}
      {phase === 'failed' && <FailCard />}
      {phase === 'credits' && <CreditsCard />}
    </div>
  )
}

function HubChrome() {
  const selected = useGameStore((s) => s.selectedLevel)
  const save = useGameStore((s) => s.save)
  const shopOpen = useGameStore((s) => s.shopOpen)
  const settingsOpen = useGameStore((s) => s.settingsOpen)
  const meta = levelCatalog[selected - 1]
  const record = save.levels[String(selected)]
  const locked = selected > save.unlockedLevel

  return (
    <>
      {!shopOpen && (
      <div className="hub-top">
        <div className="hub-brand">
          <p className="kicker">Aventura de inglés</p>
          <h1>You Law Game</h1>
        </div>
        <div className="hub-actions">
          <span className="xp-chip">{save.wallet} 🪙</span>
          <span className="xp-chip xp">{save.xp} XP</span>
          <button type="button" onClick={() => useGameStore.getState().setShopOpen(true)}>
            Tienda
          </button>
          <button type="button" onClick={() => useGameStore.getState().setSettingsOpen(true)}>
            Audio
          </button>
        </div>
      </div>
      )}
      {!shopOpen && (
      <div className="hub-card">
        <div className="hub-card-head">
          <span className="hub-level-no">{String(selected).padStart(2, '0')}</span>
          <div>
            <p className="kicker">{meta?.hubLabel}</p>
            <h2>{meta?.name}</h2>
          </div>
        </div>
        <p className="hub-sub">{meta?.subtitle}</p>
        <p className="theme">{meta?.theme}</p>
        <p className="stars">{starLine(record?.stars ?? 0)}</p>
        {record && <p className="muted">Mejor {formatTime(record.bestTime)}</p>}
        <button
          type="button"
          className="primary hub-play"
          disabled={locked}
          onClick={() => {
            audio.unlock()
            audio.startMusic()
            useGameStore.getState().startLevel(selected)
          }}
        >
          {locked ? 'Bloqueado' : 'Jugar'}
        </button>
        <p className="hint">A / D elige · Enter jugar · Clic en una plataforma</p>
      </div>
      )}
      {shopOpen && <ShopPanel />}
      {settingsOpen && <SettingsPanel />}
    </>
  )
}

function HUD() {
  const lives = useGameStore((s) => s.lives)
  const streak = useGameStore((s) => s.streak)
  const elapsed = useGameStore((s) => s.elapsed)
  const prompt = useGameStore((s) => s.prompt)
  const toast = useGameStore((s) => s.toast)
  const xpPopup = useGameStore((s) => s.xpPopup)
  const phase = useGameStore((s) => s.phase)
  const challengeTimeLeft = useGameStore((s) => s.challengeTimeLeft)
  const mistake = useGameStore((s) => s.mistake)
  const coachLine = useGameStore((s) => s.coachLine)
  const coins = useGameStore((s) => s.coins)
  if (phase === 'results' || phase === 'failed' || phase === 'credits') return null

  return (
    <>
      <div className="hud-top">
        <div className="lives">{'❤️'.repeat(Math.max(0, lives))}{'🖤'.repeat(Math.max(0, 3 - lives))}</div>
        <div className={`streak ${streak >= 2 ? 'hot' : ''}`}>{streak >= 2 ? `STREAK x${streak}` : 'STREAK x0'}</div>
        <div className="time">{coins} 🪙 · {formatTime(elapsed)}</div>
      </div>
      {prompt && <div className="prompt">{prompt}</div>}
      {prompt && challengeTimeLeft > 0 && !mistake && (
        <div className={`q-timer ${challengeTimeLeft <= 5 ? 'urgent' : ''}`}>{Math.ceil(challengeTimeLeft)}</div>
      )}
      {coachLine && <div className="coach">{coachLine}</div>}
      {toast && <div className="toast">{toast}</div>}
      {xpPopup && <div className="xp-pop">{xpPopup}</div>}
      {mistake && <ExplainCard />}
    </>
  )
}

function IntroCard() {
  const levelId = useGameStore((s) => s.levelId)
  const level = getLevel(levelId)
  useEffect(() => {
    audio.unlock()
    // quite la voz -Carlos
    //audio.speakGuide(
    //  `Nivel ${level.id}. ${level.name}. ${level.subtitle}. W avanza y espacio salta.`,
    //)
    return () => audio.stopSpeech()
  }, [level.id, level.name, level.subtitle])
  return (
    <div className="modal">
      <p className="kicker">{level.hubLabel}</p>
      <h2>
        Level {String(level.id).padStart(2, '0')}
      </h2>
      <h3>{level.name}</h3>
      <p>{level.subtitle}</p>
      <p className="theme">{level.theme}</p>
      <p className="hint">W run · A D strafe · Space jump · Shift sprint · Esc pause</p>
      <button type="button" className="primary" onClick={() => {
        (document.activeElement as HTMLElement | null)?.blur()
        useGameStore.getState().setPhase('countdown')
      }}>
        Start
      </button>
      <button type="button" onClick={() => useGameStore.getState().backToHub()}>
        Hub
      </button>
    </div>
  )
}

function Countdown() {
  const [value, setValue] = useState('3')
  useEffect(() => {
    const steps = ['3', '2', '1', 'GO!']
    let i = 0
    audio.play('countdown')
    const id = window.setInterval(() => {
      i += 1
      if (i >= steps.length) {
        window.clearInterval(id)
        audio.play('go')
        const idLevel = useGameStore.getState().levelId
        if (idLevel === 1) {
          const line = 'Adelante con W. Salta el muro rojo con la barra espaciadora. Recoge monedas para la tienda.'
          useGameStore.getState().setCoachLine(line)
          //audio.speakGuide(line)
        }
        useGameStore.getState().setPhase('play')
        return
      }
      const next = steps[i] ?? 'GO!'
      setValue(next)
      audio.play(next === 'GO!' ? 'go' : 'countdown')
    }, 700)
    return () => window.clearInterval(id)
  }, [])
  return <div className="countdown">{value}</div>
}

function PauseCard() {
  return (
    <div className="modal">
      <h2>Paused</h2>
      <button type="button" className="primary" onClick={() => useGameStore.getState().setPhase('play')}>
        Resume
      </button>
      <button type="button" onClick={() => useGameStore.getState().backToHub()}>
        Hub
      </button>
    </div>
  )
}

function ResultsCard() {
  const results = useGameStore((s) => s.results)
  const levelId = useGameStore((s) => s.levelId)
  if (!results) return null
  return (
    <div className="modal">
      <p className="kicker">LEVEL COMPLETE</p>
      <h2>{starLine(results.stars)}</h2>
      <ul className="stats">
        <li>Accuracy {Math.round(results.accuracy * 100)}%</li>
        <li>Time {formatTime(results.time)}</li>
        <li>Mistakes {results.mistakes}</li>
        <li>Best Streak x{results.bestStreak}</li>
      </ul>
      <p className="xp-chip">+{results.xp} XP</p>
      <div className="row">
        {levelId < 10 && (
          <button type="button" className="primary" onClick={() => useGameStore.getState().startLevel(levelId + 1)}>
            Next level
          </button>
        )}
        <button type="button" onClick={() => useGameStore.getState().startLevel(levelId)}>
          Replay
        </button>
        <button type="button" onClick={() => useGameStore.getState().backToHub()}>
          Hub
        </button>
      </div>
    </div>
  )
}

function ExplainCard() {
  const mistake = useGameStore((s) => s.mistake)
  if (!mistake) return null
  return (
    <div className="modal explain">
      <p className="kicker">{mistake.lastLife ? 'SE ACABARON LAS 3 VIDAS' : 'RESPUESTA INCORRECTA'}</p>
      <h2>{mistake.lastLife ? 'Por eso fallaste' : '¿Por qué está mal?'}</h2>
      <p className="explain-text">{mistake.text}</p>
      <button type="button" className="primary" onClick={() => useGameStore.getState().dismissMistake()}>
        {mistake.lastLife ? 'Ver resultado' : 'Continuar'}
      </button>
    </div>
  )
}

function FailCard() {
  const levelId = useGameStore((s) => s.levelId)
  const lastExplanation = useGameStore((s) => s.lastExplanation)
  return (
    <div className="modal">
      <h2>LEVEL FAILED</h2>
      <p>Se agotaron las 3 vidas.</p>
      {lastExplanation && <p className="explain-text">{lastExplanation}</p>}
      <div className="row">
        <button type="button" className="primary" onClick={() => useGameStore.getState().startLevel(levelId)}>
          Restart
        </button>
        <button type="button" onClick={() => useGameStore.getState().backToHub()}>
          Hub
        </button>
      </div>
    </div>
  )
}

function CreditsCard() {
  const results = useGameStore((s) => s.results)
  const save = useGameStore((s) => s.save)
  if (!results) return null
  return (
    <div className="modal wide">
      <p className="kicker">CONGRATULATIONS</p>
      <h2>ENGLISH BRIDGE</h2>
      <h3>10 / 10 LEVELS</h3>
      <ul className="stats">
        <li>Run time {formatTime(results.time)}</li>
        <li>Accuracy {Math.round(results.accuracy * 100)}%</li>
        <li>Mistakes {results.mistakes}</li>
        <li>Best streak x{results.bestStreak}</li>
        <li>Stars {starLine(results.stars)}</li>
        <li>Career {save.totals.stars} stars · {save.xp} XP</li>
      </ul>
      <p className="xp-chip">+{results.xp} XP</p>
      <div className="row">
        <button type="button" className="primary" onClick={() => useGameStore.getState().backToHub()}>
          Return to hub
        </button>
      </div>
    </div>
  )
}

function SettingsPanel() {
  const settings = useGameStore((s) => s.save.settings)
  return (
    <div className="modal">
      <h2>Audio</h2>
      <label className="check">
        <input
          type="checkbox"
          checked={settings.muted}
          onChange={(e) => useGameStore.getState().updateSettings({ muted: e.target.checked })}
        />
        Mute
      </label>
      <label>
        SFX
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={settings.sfx}
          onChange={(e) => useGameStore.getState().updateSettings({ sfx: Number(e.target.value) })}
        />
      </label>
      <label>
        Music
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={settings.music}
          onChange={(e) => useGameStore.getState().updateSettings({ music: Number(e.target.value) })}
        />
      </label>
      <button type="button" onClick={() => useGameStore.getState().setSettingsOpen(false)}>
        Close
      </button>
    </div>
  )
}

function starLine(stars: number) {
  return `${'⭐'.repeat(stars)}${'☆'.repeat(Math.max(0, 5 - stars))}`
}
