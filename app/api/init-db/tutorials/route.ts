import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar si la tabla existe
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tutoriales'
      );
    `

    let message = ""

    if (!tableCheck[0].exists) {
      // Crear la tabla si no existe
      await sql`
        CREATE TABLE tutoriales (
          id SERIAL PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          descripcion TEXT,
          nivel VARCHAR(50) NOT NULL,
          video_url TEXT,
          imagen_url TEXT,
          contenido TEXT,
          pasos JSONB,
          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      message += "Tabla 'tutoriales' creada. "

      // Insertar datos de ejemplo
      await sql`
        INSERT INTO tutoriales (titulo, descripcion, nivel, video_url, pasos)
        VALUES 
          ('Cómo hacer un Ollie', 'Aprende el truco básico del skateboarding', 'principiante', 'https://youtube.com/watch?v=ollie', '{"pasos": [{"Posiciona el pie trasero": "Coloca el pie trasero en la cola del skate"}]}'),
          ('Cómo hacer un Kickflip', 'Lleva tu skateboarding al siguiente nivel', 'intermedio', 'https://youtube.com/watch?v=kickflip', '{"pasos": [{"Posición de los pies": "Coloca el pie delantero en diagonal"}]}')
      `
      message += "Datos de ejemplo insertados."
    } else {
      message = "La tabla 'tutoriales' ya existe."
    }

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("Error al inicializar la tabla de tutoriales:", error)
    return NextResponse.json({ error: "Error al inicializar la tabla de tutoriales" }, { status: 500 })
  }
}
