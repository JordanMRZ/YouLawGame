export interface TutorialStep {
  kicker: string
  title: string
  body: string
  keys: string
  voice: string
}

export const level1Tutorial: TutorialStep[] = [
  {
    kicker: 'Tutorial',
    title: 'Así se juega',
    body: 'You Law Game es un recorrido. Avanzas, saltas obstáculos y eliges la palabra correcta. No hay menú de quiz: la respuesta es el camino.',
    keys: 'Sigue las instrucciones en voz alta',
    voice: 'Hola. Soy tu guía. You Law Game es un recorrido. Avanzas, saltas y eliges la palabra correcta. No hay quiz en pantalla: la respuesta es el camino.',
  },
  {
    kicker: 'Moverse',
    title: 'Camina y mira',
    body: 'W avanza. S retrocede un poco. A y D se mueven a los lados. Shift es un sprint corto. Esc pausa.',
    keys: 'W avance · A D lados · Shift sprint · Esc pausa',
    voice: 'Para moverte: W avanza. A y D van a los lados. Shift es un sprint corto. Escape pausa el juego.',
  },
  {
    kicker: 'Obstáculos',
    title: 'Salta el muro rojo',
    body: 'El primer muro rojo cubre todo el camino. Tienes que saltar con Espacio. Si caes, pierdes una vida y vuelves al checkpoint.',
    keys: 'Espacio = salto',
    voice: 'El muro rojo cubre todo el camino. Tienes que saltarlo con la barra espaciadora. Si caes, pierdes una vida y vuelves al último checkpoint.',
  },
  {
    kicker: 'Inglés',
    title: 'Elige la palabra',
    body: 'Cuando llegues a una pregunta, aparece la frase y un cronómetro. Camina hacia la palabra correcta. Si te equivocas o te pasas, te explico por qué.',
    keys: 'Elige la palabra · no pases de largo',
    voice: 'Cuando llegues a una pregunta, verás la frase y un cronómetro. Elige la palabra correcta. Si te pasas o te equivocas, te explico por qué.',
  },
  {
    kicker: 'Progreso',
    title: 'Monedas y meta',
    body: 'Las monedas sirven para comprar ropa en la tienda del hub. Los checkpoints te impiden volver atrás. Cruza el arco final para completar el nivel.',
    keys: 'Monedas = tienda · Checkpoint = guardado',
    voice: 'Recolecta monedas para la tienda de ropa. Los checkpoints guardan tu progreso. Cruza el arco final para terminar el nivel. ¡Vamos!',
  },
]
