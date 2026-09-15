function pickVoice(langPrefix: string, prefer: RegExp) {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith(langPrefix) && prefer.test(voice.name)) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(langPrefix)) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(langPrefix.slice(0, 2)))
  )
}

function speak(text: string, lang: string, rate: number, pitch: number, prefer: RegExp) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = rate
  utterance.pitch = pitch
  const voice = pickVoice(lang.toLowerCase(), prefer)
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

export function speakEnglish(text: string) {
  speak(text, 'en-US', 0.92, 1, /google|samantha|daniel|jenny|aria|david|zira/i)
}

export function speakGuide(text: string) {
  speak(text, 'es-MX', 0.96, 1.02, /google|sabina|paulina|helena|lucia|jorge|pablo|dalia|spanish/i)
}

export function stopSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices()
  })
}
