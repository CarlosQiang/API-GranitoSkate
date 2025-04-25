import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`Obteniendo tutorial con ID: ${id}`)

    const tutorial = await sql`SELECT * FROM tutoriales WHERE id = ${id}`

    if (tutorial.length === 0) {
      return NextResponse.json({ error: "Tutorial no encontrado" }, { status: 404 })
    }

    console.log("Tutorial encontrado:", JSON.stringify(tutorial[0]))
    return NextResponse.json(tutorial[0])
  } catch (error) {
    console.error("Error al obtener tutorial:", error)
    return NextResponse.json({ error: "Error al obtener tutorial" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    console.log(`Actualizando tutorial con ID: ${id}`, JSON.stringify(body))

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

    // Actualización con manejo explícito de valores nulos
    const result = await sql`
      UPDATE tutoriales
      SET 
        titulo = ${titulo}, 
        descripcion = ${descripcion || null}, 
        nivel = ${nivel}, 
        video_url = ${video_url || null}, 
        imagen_url = ${imagen_url || null}, 
        contenido = ${contenido || null},
        pasos = ${pasosJSON}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Tutorial no encontrado" }, { status: 404 })
    }

    console.log("Tutorial actualizado:", JSON.stringify(result[0]))
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar tutorial:", error)
    return NextResponse.json({ error: "Error al actualizar tutorial" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
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
