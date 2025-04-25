import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const tutorial = await sql`SELECT * FROM tutoriales WHERE id = ${id}`

    if (tutorial.length === 0) {
      return NextResponse.json({ error: "Tutorial no encontrado" }, { status: 404 })
    }

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
    const { titulo, descripcion, nivel, video_url, imagen_url, contenido } = body

    if (!titulo || !descripcion || !nivel || !video_url || !imagen_url || !contenido) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      UPDATE tutoriales
      SET titulo = ${titulo}, descripcion = ${descripcion}, nivel = ${nivel}, 
          video_url = ${video_url}, imagen_url = ${imagen_url}, contenido = ${contenido}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Tutorial no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar tutorial:", error)
    return NextResponse.json({ error: "Error al actualizar tutorial" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await sql`DELETE FROM tutoriales WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Tutorial no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Tutorial eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar tutorial:", error)
    return NextResponse.json({ error: "Error al eliminar tutorial" }, { status: 500 })
  }
}
