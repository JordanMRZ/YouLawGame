import { getListeningUrl } from './listening'
import { sfx, startMusic, stopMusic, unlockAudio } from './sfx'
import { speakEnglish, speakGuide, stopSpeech } from './speech'

export type SfxName = keyof typeof sfx

let sfxVolume = 0.85
let musicVolume = 0.35
let muted = false

export const audio = {
  async unlock() {
    await unlockAudio()
  },
  configure(next: { sfx: number; music: number; muted: boolean }) {
    sfxVolume = next.sfx
    musicVolume = next.music
    muted = next.muted
    if (muted || musicVolume <= 0.01) stopMusic()
    else startMusic(musicVolume)
  },
  play(name: SfxName) {
    if (muted) return
    sfx[name](sfxVolume)
  },
  startMusic() {
    if (muted) return
    startMusic(musicVolume)
  },
  stopMusic,
  stopSpeech,
  speakGuide(text: string) {
    if (muted) return
    speakGuide(text)
  },
  speakEnglish(text: string) {
    if (muted) return
    speakEnglish(text)
  },
  playListening(key: string | undefined, fallbackText: string) {
    if (muted) {
      speakEnglish(fallbackText)
      return
    }
    const url = getListeningUrl(key)
    if (!url) {
      speakEnglish(fallbackText)
      return
    }
    const clip = new Audio(url)
    clip.volume = Math.min(1, sfxVolume)
    clip.play().catch(() => speakEnglish(fallbackText))
  },
}
