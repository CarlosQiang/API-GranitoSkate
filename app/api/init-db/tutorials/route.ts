import { NextResponse } from "next/server"
import { queryApp } from "../../db"

export async function GET() {
  try {
    // Verificar si la tabla existe
    try {
      await queryApp("SELECT 1 FROM tutoriales LIMIT 1")
      console.log("La tabla tutoriales ya existe")
    } catch (error) {
      console.log("Creando tabla tutoriales...")
      // Crear la tabla si no existe
      await queryApp(`
        CREATE TABLE IF NOT EXISTS tutoriales (
          id SERIAL PRIMARY KEY,
          titulo TEXT NOT NULL,
          descripcion TEXT,
          contenido TEXT NOT NULL,
          nivel TEXT NOT NULL,
          imagen_url TEXT,
          video_url TEXT,
          fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `)
      console.log("Tabla tutoriales creada correctamente")

      // Insertar datos de ejemplo
      await createSampleTutorials()
    }

    return NextResponse.json({ message: "Base de datos de tutoriales inicializada correctamente" })
  } catch (error) {
    console.error("Error al inicializar la base de datos de tutoriales:", error)
    return NextResponse.json({ error: "Error al inicializar la base de datos de tutoriales" }, { status: 500 })
  }
}

// Función para crear tutoriales de ejemplo
async function createSampleTutorials() {
  try {
    // Crear tutoriales de ejemplo
    const sampleTutorials = [
      {
        titulo: "Cómo hacer un Ollie",
        descripcion: "Aprende los fundamentos del truco más básico del skateboarding",
        contenido: `
# Cómo hacer un Ollie

El Ollie es el truco fundamental del skateboarding y la base para casi todos los demás trucos.

## Pasos:

1. **Posición inicial**: Coloca tu pie trasero en la cola de la tabla y el delantero cerca de los tornillos delanteros.
2. **Preparación**: Flexiona las rodillas y baja el cuerpo.
3. **Pop**: Golpea firmemente la cola contra el suelo con tu pie trasero.
4. **Deslizamiento**: Mientras la tabla se eleva, desliza tu pie delantero hacia la punta de la tabla.
5. **Nivelación**: Levanta tu pie trasero para nivelar la tabla en el aire.
6. **Aterrizaje**: Aterriza con ambos pies sobre los tornillos para mantener el control.

## Consejos:
- Practica primero estando parado, luego en movimiento
- Mantén los hombros paralelos a la tabla
- No tengas miedo de comprometer el pop
- La altura viene con la práctica

¡Buena suerte!
        `,
        nivel: "Principiante",
        imagen_url: "https://example.com/ollie.jpg",
        video_url: "https://www.youtube.com/watch?v=QkeOAcj8Y5k",
      },
      {
        titulo: "Kickflip para principiantes",
        descripcion: "Guía paso a paso para aprender a hacer un kickflip",
        contenido: `
# Kickflip para principiantes

El kickflip es uno de los trucos más icónicos del skateboarding.

## Requisitos previos:
- Dominar el ollie
- Estar cómodo andando en la tabla

## Pasos:

1. **Posición de los pies**: Pie trasero en la cola, pie delantero un poco más atrás de los tornillos delanteros y ligeramente inclinado.
2. **Pop y deslizamiento**: Haz un ollie, pero cuando deslices el pie delantero, hazlo en diagonal hacia el lado del talón.
3. **Flick**: Al llegar a la punta de la tabla, da un "toque" con el lado exterior del pie para hacer que la tabla gire.
4. **Mantén la tabla debajo**: Mantén los hombros alineados con la tabla y no gires el cuerpo.
5. **Atrapa la tabla**: Después de que la tabla complete una rotación completa, atrápala con ambos pies.

## Errores comunes:
- La tabla no gira completamente: Necesitas más flick
- La tabla se va hacia adelante: Mantén tu peso centrado
- No puedes aterrizar: Practica primero atrapando la tabla con el pie trasero

¡No te desanimes si no sale a la primera, la constancia es clave!
        `,
        nivel: "Intermedio",
        imagen_url: "https://example.com/kickflip.jpg",
        video_url: "https://www.youtube.com/watch?v=VasSLuFO4wY",
      },
      {
        titulo: "Mantenimiento de tu skate",
        descripcion: "Aprende a mantener tu skateboard en óptimas condiciones",
        contenido: `
# Mantenimiento de tu skateboard

Un buen mantenimiento alargará la vida de tu skateboard y mejorará tu experiencia al patinar.

## Herramientas necesarias:
- Llave T o llave Allen
- Destornillador
- Lubricante para rodamientos
- Limpiador de grip
- Trapos limpios

## Mantenimiento de rodamientos:

1. **Extracción**: Quita las ruedas y saca los rodamientos con el eje del truck o una herramienta específica.
2. **Limpieza**: Quita los protectores y sumerge los rodamientos en alcohol isopropílico o un limpiador específico.
3. **Secado**: Seca completamente los rodamientos con aire comprimido o déjalos secar al aire.
4. **Lubricación**: Aplica 2-3 gotas de lubricante específico para rodamientos y gíralos para distribuirlo.
5. **Montaje**: Vuelve a colocar los protectores y monta los rodamientos en las ruedas.

## Otros consejos:
- Revisa y ajusta los trucks regularmente
- Limpia el grip con un cepillo de goma o específico para grip
- Revisa el desgaste de la tabla y cámbiala cuando sea necesario
- Rota las ruedas para que se desgasten uniformemente

Un skateboard bien mantenido no solo durará más, sino que también será más seguro y responderá mejor.
        `,
        nivel: "Todos los niveles",
        imagen_url: "https://example.com/mantenimiento.jpg",
        video_url: "https://www.youtube.com/watch?v=f3CUb1gJjCY",
      },
      {
        titulo: "Cómo hacer un 50-50 Grind",
        descripcion: "Aprende a hacer tu primer grind en un bordillo o rail",
        contenido: `
# Cómo hacer un 50-50 Grind

El 50-50 es el grind más básico y una excelente introducción a los trucos de obstáculos.

## Preparación:
- Busca un bordillo bajo o una caja pequeña para empezar
- Asegúrate de tener trucks que se deslicen bien (los nuevos pueden necesitar ser "ablandados")

## Pasos:

1. **Aproximación**: Acércate al obstáculo en paralelo y a velocidad moderada.
2. **Ollie**: Haz un ollie cuando estés cerca del borde del obstáculo.
3. **Posicionamiento**: Asegúrate de que ambos trucks aterricen en el borde o rail.
4. **Balance**: Mantén tu peso centrado sobre la tabla, con las rodillas flexionadas.
5. **Salida**: Para salir, haz un pequeño ollie o simplemente deja que la tabla salga del obstáculo.

## Consejos:
- Mira el obstáculo al acercarte, pero una vez encima, mira hacia donde quieres ir
- Mantén los hombros paralelos a la dirección del grind
- Flexiona las rodillas para absorber impactos y mantener el control
- Empieza con obstáculos bajos y ve progresando

Recuerda que la clave está en el compromiso y la confianza. ¡No tengas miedo!
        `,
        nivel: "Intermedio",
        imagen_url: "https://example.com/5050.jpg",
        video_url: "https://www.youtube.com/watch?v=2jH4T3LQvUs",
      },
      {
        titulo: "Trucos de flatground avanzados",
        descripcion: "Lleva tus trucos de suelo al siguiente nivel",
        contenido: `
# Trucos de flatground avanzados

Una vez que domines los trucos básicos como el ollie, kickflip y heelflip, es hora de avanzar a combinaciones más complejas.

## Trucos a dominar:

### 360 Flip (Tre Flip)
1. Posición similar al kickflip pero con el pie trasero más en el borde de la cola
2. Pop con fuerza mientras giras el pie delantero como en un kickflip
3. Usa el pie trasero para ayudar a la rotación de 360 grados
4. Mantén la vista en la tabla para seguir la rotación completa

### Varial Heelflip
1. Posición de heelflip normal
2. Al hacer pop, gira ligeramente los hombros en dirección contraria a la rotación deseada
3. El pie trasero ayuda a la rotación de 180 grados mientras el delantero hace el flip
4. Atrapa la tabla después de la rotación completa

### Hardflip
1. Mezcla entre frontside pop shove-it y kickflip
2. Posición de pies similar al kickflip
3. Pop mientras empujas la tabla hacia adelante y haces el flip
4. La tabla debe rotar verticalmente y girar 180 grados

## Consejos para la progresión:
- Domina cada truco por separado antes de intentar combinaciones
- Practica primero estático para entender la mecánica
- Filma tus intentos para analizar qué estás haciendo mal
- La consistencia viene con la repetición, practica el mismo truco muchas veces

Recuerda que la progresión debe ser gradual. No intentes trucos demasiado avanzados antes de dominar los fundamentos. La paciencia y la persistencia son las claves del éxito en el skateboarding.
        `,
        nivel: "Avanzado",
        imagen_url: "https://example.com/advanced.jpg",
        video_url: "https://www.youtube.com/watch?v=h7OGMb5aBzU",
      },
    ]

    for (const tutorial of sampleTutorials) {
      await queryApp(
        `
        INSERT INTO tutoriales (titulo, descripcion, contenido, nivel, imagen_url, video_url)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          tutorial.titulo,
          tutorial.descripcion,
          tutorial.contenido,
          tutorial.nivel,
          tutorial.imagen_url,
          tutorial.video_url,
        ],
      )
    }

    console.log("Tutoriales de ejemplo creados correctamente")
  } catch (error) {
    console.error("Error al crear tutoriales de ejemplo:", error)
    throw error
  }
}
