import { useEffect } from 'react'
import { audio } from '../audio/audioManager'
import { level1Tutorial } from '../data/tutorial'
import { useGameStore } from '../store/gameStore'

export function TutorialCard() {
  const step = useGameStore((s) => s.tutorialStep)
  const card = level1Tutorial[step] ?? level1Tutorial[0]
  const last = step >= level1Tutorial.length - 1

  useEffect(() => {
    audio.unlock()
    audio.speakGuide(card.voice)
    return () => audio.stopSpeech()
  }, [card.voice, step])

  const next = () => {
    ;(document.activeElement as HTMLElement | null)?.blur()
    if (last) {
      audio.stopSpeech()
      useGameStore.getState().setPhase('countdown')
      return
    }
    useGameStore.getState().setTutorialStep(step + 1)
  }

  return (
    <div className="modal tutorial">
      <p className="kicker">
        {card.kicker} · {step + 1}/{level1Tutorial.length}
      </p>
      <h2>{card.title}</h2>
      <p className="explain-text">{card.body}</p>
      <p className="hint">{card.keys}</p>
      <div className="row">
        <button type="button" className="primary" onClick={next}>
          {last ? 'Empezar' : 'Siguiente'}
        </button>
        <button
          type="button"
          onClick={() => {
            audio.stopSpeech()
            useGameStore.getState().setPhase('countdown')
          }}
        >
          Saltar tutorial
        </button>
      </div>
    </div>
  )
}
