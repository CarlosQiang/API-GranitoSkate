import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Obteniendo tutoriales...")

    // Consulta directa a la tabla tutoriales
    const tutorials = await sql`
      SELECT * FROM tutoriales ORDER BY id ASC
    `

    console.log("Tutoriales obtenidos:", JSON.stringify(tutorials))
    return NextResponse.json(tutorials)
  } catch (error) {
    console.error("Error al obtener tutoriales:", error)
    return NextResponse.json({ error: "Error al obtener tutoriales" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Datos recibidos en POST:", JSON.stringify(body))

    const { titulo, descripcion, nivel, video_url, imagen_url, contenido, pasos } = body

    if (!titulo || !nivel) {
      return NextResponse.json({ error: "Título y nivel son campos requeridos" }, { status: 400 })
    }

    // Procesamiento seguro de pasos para evitar errores de JSON
    let pasosJSON = null
    if (pasos) {
      try {
        // Si pasos ya es un objeto, lo convertimos a JSON string
        pasosJSON = typeof pasos === "string" ? pasos : JSON.stringify(pasos)
      } catch (e) {
        console.error("Error al procesar pasos:", e)
        // Si hay error, usamos un array vacío
        pasosJSON = "[]"
      }
    }

    console.log("Insertando tutorial con pasos:", pasosJSON)

    // Inserción con manejo explícito de valores nulos
    const result = await sql`
      INSERT INTO tutoriales (
        titulo, 
        descripcion, 
        nivel, 
        video_url, 
        imagen_url, 
        contenido, 
        pasos
      ) VALUES (
        ${titulo}, 
        ${descripcion || null}, 
        ${nivel}, 
        ${video_url || null}, 
        ${imagen_url || null}, 
        ${contenido || null}, 
        ${pasosJSON}
      )
      RETURNING *
    `

    console.log("Tutorial insertado:", JSON.stringify(result[0]))
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear tutorial:", error)
    return NextResponse.json({ error: "Error al crear tutorial", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID de tutorial requerido" }, { status: 400 })
    }

    const result = await sql`DELETE FROM tutoriales WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Tutorial no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Tutorial eliminado correctamente", id: result[0].id })
  } catch (error) {
    console.error("Error al eliminar tutorial:", error)
    return NextResponse.json({ error: "Error al eliminar tutorial" }, { status: 500 })
  }
}
