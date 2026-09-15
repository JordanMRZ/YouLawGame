let ctx: AudioContext | null = null
let musicTimer: number | null = null
let musicOn = false

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  return ctx
}

export async function unlockAudio() {
  const audio = context()
  if (!audio) return
  if (audio.state === 'suspended') await audio.resume()
}

function now() {
  return context()?.currentTime ?? 0
}

function envGain(duration: number, peak: number, t0: number) {
  const audio = context()
  if (!audio) return null
  const gain = audio.createGain()
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  gain.connect(audio.destination)
  return gain
}

function tone(freq: number, duration: number, type: OscillatorType, volume: number, delay = 0) {
  const audio = context()
  if (!audio) return
  const t0 = now() + delay
  const gain = envGain(duration, volume, t0)
  if (!gain) return
  const osc = audio.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  osc.connect(gain)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export const sfx = {
  jump(vol: number) {
    tone(420, 0.09, 'square', vol * 0.12)
    tone(620, 0.08, 'sine', vol * 0.08, 0.02)
  },
  land(vol: number) {
    tone(140, 0.08, 'triangle', vol * 0.16)
  },
  correct(vol: number) {
    tone(523, 0.1, 'sine', vol * 0.18)
    tone(659, 0.12, 'sine', vol * 0.16, 0.07)
    tone(784, 0.16, 'sine', vol * 0.14, 0.14)
  },
  wrong(vol: number) {
    tone(220, 0.18, 'sawtooth', vol * 0.14)
    tone(160, 0.22, 'square', vol * 0.1, 0.05)
  },
  checkpoint(vol: number) {
    tone(880, 0.1, 'sine', vol * 0.14)
    tone(1320, 0.14, 'sine', vol * 0.12, 0.08)
  },
  coin(vol: number) {
    tone(980, 0.07, 'square', vol * 0.1)
    tone(1480, 0.1, 'sine', vol * 0.08, 0.05)
  },
  fall(vol: number) {
    const audio = context()
    if (!audio) return
    const t0 = now()
    const gain = envGain(0.4, vol * 0.16, t0)
    if (!gain) return
    const osc = audio.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(500, t0)
    osc.frequency.exponentialRampToValueAtTime(80, t0 + 0.38)
    osc.connect(gain)
    osc.start(t0)
    osc.stop(t0 + 0.42)
  },
  countdown(vol: number) {
    tone(440, 0.08, 'triangle', vol * 0.16)
  },
  go(vol: number) {
    tone(660, 0.12, 'square', vol * 0.16)
    tone(880, 0.16, 'sine', vol * 0.14, 0.05)
  },
  complete(vol: number) {
    tone(523, 0.12, 'sine', vol * 0.16)
    tone(659, 0.12, 'sine', vol * 0.16, 0.1)
    tone(784, 0.12, 'sine', vol * 0.16, 0.2)
    tone(1046, 0.22, 'sine', vol * 0.18, 0.32)
  },
  fail(vol: number) {
    tone(196, 0.2, 'triangle', vol * 0.16)
    tone(147, 0.28, 'sine', vol * 0.14, 0.12)
  },
}

export function startMusic(volume: number) {
  stopMusic()
  const audio = context()
  if (!audio || volume <= 0.01) return
  musicOn = true
  const notes = [196, 247, 294, 330, 392, 330, 294, 247]
  let step = 0
  const tick = () => {
    if (!musicOn) return
    const freq = notes[step % notes.length] ?? 196
    tone(freq, 0.35, 'sine', volume * 0.045)
    tone(freq / 2, 0.4, 'triangle', volume * 0.03)
    step += 1
    musicTimer = window.setTimeout(tick, 520)
  }
  tick()
}

export function stopMusic() {
  musicOn = false
  if (musicTimer !== null) {
    window.clearTimeout(musicTimer)
    musicTimer = null
  }
}
