import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de evento requerido" }, { status: 400 })
  }

  try {
    const event = await sql`SELECT * FROM eventos WHERE id = ${id}`

    if (event.length === 0) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }

    return NextResponse.json(event[0])
  } catch (error) {
    console.error("Error al obtener evento:", error)
    return NextResponse.json({ error: "Error al obtener evento" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de evento requerido" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, imagen_url } = body

    const result = await sql`
      UPDATE eventos
      SET titulo = ${titulo}, descripcion = ${descripcion}, 
          fecha_inicio = ${fecha_inicio}, fecha_fin = ${fecha_fin},
          ubicacion = ${ubicacion}, imagen_url = ${imagen_url}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar evento:", error)
    return NextResponse.json({ error: "Error al actualizar evento" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de evento requerido" }, { status: 400 })
  }

  try {
    const result = await sql`DELETE FROM eventos WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Evento eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar evento:", error)
    return NextResponse.json({ error: "Error al eliminar evento" }, { status: 500 })
  }
}
