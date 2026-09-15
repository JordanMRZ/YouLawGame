/**
 * Listening clips live in /public/audio/listening/{key}.mp3
 * If a file is missing, the game falls back to speechSynthesis.
 */
export const listeningManifest: Record<string, string> = {
  // 'lv5-1': '/audio/listening/lv5-1.mp3',
}

export function getListeningUrl(key: string | undefined): string | null {
  if (!key) return null
  return listeningManifest[key] ?? `/audio/listening/${key}.mp3`
}
