import { lessonFor } from '../data/explanations'
import type { ChallengeDef } from '../data/types'

export type MissReason = 'wrong' | 'timeout' | 'passed'

export function explainMistake(challenge: ChallengeDef, chosen: string, reason: MissReason): string {
  const note = lessonFor(challenge.sentence)
  const why = challenge.explanation ?? note?.why ?? `La respuesta correcta es ${challenge.correctAnswer}.`
  if (reason === 'timeout') {
    return `Se acabó el tiempo. La respuesta correcta es ${challenge.correctAnswer}. ${why}`
  }
  if (reason === 'passed') {
    return `Pasaste de largo sin pisar una plataforma. La respuesta correcta es ${challenge.correctAnswer}. ${why}`
  }
  const specific = challenge.wrongWhy?.[chosen] ?? note?.wrong[chosen]
  if (specific) return `${chosen} no encaja. ${specific} Lo correcto es ${challenge.correctAnswer}. ${why}`
  return `${chosen} no es correcto. Debías elegir ${challenge.correctAnswer}. ${why}`
}
