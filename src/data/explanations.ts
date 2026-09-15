export interface LessonNote {
  why: string
  wrong: Record<string, string>
}

export const lessonNotes: Record<string, LessonNote> = {
  'She ___ a teacher.': {
    why: 'She es tercera persona singular (he / she / it), así que el verbo be es IS.',
    wrong: {
      ARE: 'ARE se usa con you, we o they. No con she.',
      AM: 'AM solo se usa con I.',
    },
  },
  'They ___ in the staff room.': {
    why: 'They es plural, así que el verbo be es ARE.',
    wrong: {
      IS: 'IS es para he, she o it. They necesita ARE.',
      AM: 'AM solo se usa con I.',
    },
  },
  'I ___ ready for class.': {
    why: 'Con I, el verbo be en presente es AM: I am.',
    wrong: {
      IS: 'IS es para he, she o it. Con I se usa AM.',
      ARE: 'ARE es para you, we o they. Con I se usa AM.',
    },
  },
  'He ___ to school every morning.': {
    why: 'He es tercera persona singular. En presente simple el verbo toma -s: goes.',
    wrong: {
      GO: 'GO es la forma base (I / you / we / they). Con he se dice goes.',
      GOING: 'GOING es el gerundio (-ing). Aquí hace falta un presente simple.',
    },
  },
  'She ___ English every day.': {
    why: 'She + presente simple = teaches (verbo + -es).',
    wrong: {
      TEACH: 'TEACH es la forma base. Con she se dice teaches.',
      TEACHING: 'TEACHING es -ing. La frase habla de una rutina, no de algo en progreso.',
    },
  },
  'The class ___ at eight.': {
    why: 'The class es tercera persona singular, así que starts.',
    wrong: {
      START: 'START va con I / you / we / they. The class necesita starts.',
      STARTING: 'STARTING es -ing. Aquí es un horario fijo, presente simple.',
    },
  },
  'The book is ___ the table.': {
    why: 'ON se usa cuando algo está encima de una superficie: on the table.',
    wrong: {
      UNDER: 'UNDER significa debajo. El libro está encima de la mesa.',
      BETWEEN: 'BETWEEN es entre dos cosas. Aquí solo hay una mesa.',
    },
  },
  'She sat ___ the two groups.': {
    why: 'BETWEEN se usa para algo o alguien en medio de dos elementos.',
    wrong: {
      ON: 'ON es encima de una superficie, no en medio de dos grupos.',
      ABOVE: 'ABOVE es más arriba, sin contacto. La frase pide “entre”.',
    },
  },
  'Put the papers ___ the folder.': {
    why: 'IN se usa cuando algo queda dentro de un contenedor: in the folder.',
    wrong: {
      AT: 'AT marca un punto (at school, at 8). No sirve para “dentro de”.',
      ON: 'ON es encima. Los papeles van dentro de la carpeta.',
    },
  },
  'She ___ the lesson yesterday.': {
    why: 'Yesterday pide pasado simple. El pasado de teach es taught.',
    wrong: {
      TEACH: 'TEACH es presente. Yesterday exige pasado: taught.',
      TEACHING: 'TEACHING es -ing. No es la forma de pasado.',
    },
  },
  'They ___ the exam last week.': {
    why: 'Last week pide pasado simple. El pasado de take es took.',
    wrong: {
      TAKE: 'TAKE es presente. Last week exige took.',
      TAKEN: 'TAKEN es el participio (have taken). Aquí no hay have/has.',
    },
  },
  'He ___ late to the meeting.': {
    why: 'La frase describe un hecho pasado, así que arrived.',
    wrong: {
      ARRIVES: 'ARRIVES es presente. La idea es un evento ya ocurrido.',
      ARRIVING: 'ARRIVING es -ing. Aquí hace falta el pasado simple.',
    },
  },
  'They ___ been working here for three years.': {
    why: 'They + present perfect = have. Have been working.',
    wrong: {
      HAS: 'HAS va con he / she / it. They usa have.',
      HAD: 'HAD es pasado perfecto (had been). Aquí es “desde hace tres años”, presente perfecto.',
    },
  },
  'She ___ already finished the report.': {
    why: 'She + present perfect = has. Already finished: has already finished.',
    wrong: {
      HAVE: 'HAVE va con I / you / we / they. She usa has.',
      HAD: 'HAD es pasado perfecto. Already + resultado reciente pide has.',
    },
  },
  'We ___ discussing the schedule when you called.': {
    why: 'We es plural. El pasado continuo es were discussing.',
    wrong: {
      WAS: 'WAS va con I / he / she / it. We usa were.',
      BEEN: 'BEEN necesita have/has/had delante. Aquí el auxiliar es were.',
    },
  },
  'You ___ wear a helmet here.': {
    why: 'MUST expresa obligación: es obligatorio usar casco.',
    wrong: {
      CAN: 'CAN habla de permiso o habilidad, no de una regla obligatoria.',
      MIGHT: 'MIGHT es posibilidad. El casco no es opcional aquí.',
    },
  },
  'We ___ postpone the meeting if needed.': {
    why: 'SHOULD es una recomendación: conviene posponer si hace falta.',
    wrong: {
      "MUSTN'T": 'MUSTN’T es prohibición. No estamos prohibiendo posponer.',
      "CAN'T": 'CAN’T es imposibilidad o prohibición. Aquí sí se puede posponer.',
    },
  },
  'Students ___ leave early today.': {
    why: 'MAY expresa permiso: los estudiantes tienen permitido salir temprano.',
    wrong: {
      MUST: 'MUST es obligación. Salir temprano es permiso, no una orden.',
      WOULD: 'WOULD es hipotético. Aquí se da permiso real.',
    },
  },
  'If you finish your work, you ___ go home.': {
    why: 'Primer condicional (if + presente): resultado real con CAN (permiso).',
    wrong: {
      COULD: 'COULD es más hipotético o de cortesía. Aquí el permiso es directo.',
      WOULD: 'WOULD es segundo condicional (if I were / if + pasado).',
    },
  },
  'If I were you, I ___ talk to her.': {
    why: 'If I were you es segundo condicional. El resultado lleva WOULD.',
    wrong: {
      WILL: 'WILL es futuro real. If I were you no es una situación real.',
      CAN: 'CAN no es el auxiliar típico del segundo condicional.',
    },
  },
  'If he had studied, he ___ have passed.': {
    why: 'Tercer condicional: if + past perfect → would have + participio.',
    wrong: {
      WILL: 'WILL es futuro. El tercer condicional habla de un pasado imposible de cambiar.',
      CAN: 'CAN no forma “can have passed” en este condicional. Es would have.',
    },
  },
  'The deadline is ___ Friday.': {
    why: 'Con días de la semana se usa ON: on Friday.',
    wrong: {
      IN: 'IN se usa con meses, años o periodos (in July, in 2024).',
      AT: 'AT se usa con horas (at 5) o festivos concretos (at Christmas).',
    },
  },
  'We need to ___ the agenda.': {
    why: 'REVIEW significa revisar el contenido. Es lo que se hace con una agenda.',
    wrong: {
      REVISE: 'REVISE en inglés británico es más “estudiar / corregir un texto”, no “repasar la agenda”.',
      REVERT: 'REVERT es volver a un estado anterior, no revisar un documento.',
    },
  },
  'You ___ submit the form before noon.': {
    why: 'MUST expresa obligación: hay que entregar el formulario antes del mediodía.',
    wrong: {
      MIGHT: 'MIGHT es solo posibilidad. Entregar el formulario es obligatorio.',
      WOULD: 'WOULD es hipotético o cortesía, no una obligación.',
    },
  },
  'If the printer fails, we ___ use the backup.': {
    why: 'Primer condicional: si pasa X, podemos usar el plan B. CAN encaja.',
    wrong: {
      WOULD: 'WOULD sería un segundo condicional más hipotético.',
      "MUSTN'T": 'MUSTN’T prohíbe. Si falla la impresora, sí podemos usar el backup.',
    },
  },
  'Please ___ your books to page twelve.': {
    why: 'En clase se dice open your books to page…',
    wrong: {
      START: 'START your books no es la colocación. Se abre el libro.',
      BEGIN: 'BEGIN tampoco se usa con books en esta instrucción.',
    },
  },
  'Could you ___ me with this photocopy?': {
    why: 'Help me with + tarea es la frase natural para pedir ayuda.',
    wrong: {
      MAKE: 'MAKE me with no existe. Se dice help me with.',
      GIVE: 'GIVE me with tampoco. Give necesita un objeto (give me the copy).',
    },
  },
  'We need to ___ the problem before Friday.': {
    why: 'ADDRESS the problem = ocuparse de / tratar el problema. Es inglés profesional.',
    wrong: {
      SPEAK: 'SPEAK necesita to/about: speak about the problem.',
      TELL: 'TELL necesita una persona: tell someone about the problem.',
    },
  },
  'I would like to ___ a suggestion.': {
    why: 'La colocación es make a suggestion, no say/do a suggestion.',
    wrong: {
      SAY: 'SAY a suggestion no se usa. Se dice make a suggestion.',
      DO: 'DO a suggestion tampoco. El verbo correcto es make.',
    },
  },
  'The students need more ___ before the exam.': {
    why: 'PRACTICE (nombre, inglés americano) = práctica. Need more practice.',
    wrong: {
      PRACTISE: 'PRACTISE es el verbo (británico). Después de more hace falta un nombre.',
      PRACTICAL: 'PRACTICAL es adjetivo (practical exam), no el nombre “práctica”.',
    },
  },
  'By next year, she ___ at this school for a decade.': {
    why: 'By next year + duración pide futuro perfecto: will have taught.',
    wrong: {
      'HAS TAUGHT': 'HAS TAUGHT es presente perfecto. By next year mira al futuro.',
      TAUGHT: 'TAUGHT solo es pasado. Falta will have para el futuro perfecto.',
    },
  },
  'I would like to ___ a concern about the new timetable.': {
    why: 'RAISE a concern = plantear una preocupación. Es la colocación correcta.',
    wrong: {
      RISE: 'RISE es levantarse / subir (intransitivo). No se dice rise a concern.',
      ARISE: 'ARISE es ocurrir (problems arise). No lleva objeto.',
    },
  },
  'Let’s ___ the meeting until Thursday.': {
    why: 'POSTPONE = posponer. Let’s postpone the meeting.',
    wrong: {
      PRETEND: 'PRETEND es fingir. No tiene sentido con a meeting.',
      PREVENT: 'PREVENT es impedir. La idea es cambiar la fecha, no bloquear la reunión.',
    },
  },
  'If we had more time, we ___ expand the course.': {
    why: 'If we had (pasado) es segundo condicional → WOULD + verbo.',
    wrong: {
      WILL: 'WILL es primer condicional (if we have). Aquí el if va en pasado.',
      MUST: 'MUST es obligación, no el resultado de una hipótesis.',
    },
  },
  'Could you please ___ the minutes after the meeting?': {
    why: 'SHARE the minutes = compartir el acta. Es la petición natural.',
    wrong: {
      SHORE: 'SHORE es orilla. No tiene nada que ver con el acta.',
      SHRED: 'SHRED es triturar. No queremos destruir las minutes.',
    },
  },
}

export function lessonFor(sentence?: string): LessonNote | undefined {
  if (!sentence) return undefined
  return lessonNotes[sentence]
}
