export function speakEnglish(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.92
  utterance.pitch = 1
  const voices = window.speechSynthesis.getVoices()
  const preferred =
    voices.find((voice) => voice.lang.startsWith('en') && /google|samantha|daniel|jenny|aria/i.test(voice.name)) ??
    voices.find((voice) => voice.lang.startsWith('en'))
  if (preferred) utterance.voice = preferred
  window.speechSynthesis.speak(utterance)
}

export function stopSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}
