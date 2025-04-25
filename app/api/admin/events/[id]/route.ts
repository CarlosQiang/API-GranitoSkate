import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
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
  try {
    const id = params.id
    const body = await request.json()
    const { titulo, descripcion, fecha_inicio, fecha_fin } = body

    if (!titulo || !descripcion || !fecha_inicio || !fecha_fin) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      UPDATE eventos
      SET titulo = ${titulo}, descripcion = ${descripcion}, 
          fecha_inicio = ${fecha_inicio}, fecha_fin = ${fecha_fin}
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
  try {
    const id = params.id
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
