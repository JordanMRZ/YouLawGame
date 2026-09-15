let queueTimer: number | null = null
let speakGen = 0

function pickVoice(langPrefix: string, prefer: RegExp) {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith(langPrefix) && prefer.test(voice.name)) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(langPrefix)) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(langPrefix.slice(0, 2)))
  )
}

function clearQueue() {
  if (queueTimer == null) return
  window.clearTimeout(queueTimer)
  queueTimer = null
}

function speakChunk(text: string, lang: string, rate: number, pitch: number, prefer: RegExp, onEnd?: () => void) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = rate
  utterance.pitch = pitch
  const voice = pickVoice(lang.toLowerCase(), prefer)
  if (voice) utterance.voice = voice
  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onEnd?.()
  window.speechSynthesis.speak(utterance)
}

function speakQueued(
  parts: string[],
  lang: string,
  rate: number,
  pitch: number,
  prefer: RegExp,
  gapMs: number,
) {
  if (typeof window === 'undefined' || !window.speechSynthesis || parts.length === 0) return
  window.speechSynthesis.cancel()
  clearQueue()
  const gen = ++speakGen
  let index = 0
  const play = () => {
    if (gen !== speakGen || index >= parts.length) return
    const gap = index === 0 ? 0 : gapMs
    const run = () => {
      if (gen !== speakGen) return
      const chunk = parts[index]
      if (!chunk) return
      speakChunk(chunk, lang, rate, pitch, prefer, () => {
        if (gen !== speakGen) return
        index += 1
        play()
      })
    }
    if (gap > 0) queueTimer = window.setTimeout(run, gap)
    else run()
  }
  play()
}

export function speakEnglish(text: string) {
  const parts = text
    .split(/_+/)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  speakQueued(parts, 'en-US', 0.92, 1, /google|samantha|daniel|jenny|aria|david|zira/i, 850)
}

export function speakGuide(text: string) {
  const clean = text.replace(/_+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!clean) return
  speakQueued([clean], 'es-MX', 0.96, 1.02, /google|sabina|paulina|helena|lucia|jorge|pablo|dalia|spanish/i, 0)
}

export function stopSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  speakGen += 1
  clearQueue()
  window.speechSynthesis.cancel()
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices()
  })
}
