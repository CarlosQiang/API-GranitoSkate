import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de bloque requerido" }, { status: 400 })
  }

  try {
    const block = await sql`SELECT * FROM home_blocks WHERE id = ${id}`

    if (block.length === 0) {
      return NextResponse.json({ error: "Bloque no encontrado" }, { status: 404 })
    }

    return NextResponse.json(block[0])
  } catch (error) {
    console.error("Error al obtener bloque:", error)
    return NextResponse.json({ error: "Error al obtener bloque" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de bloque requerido" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { titulo, descripcion, tipo, contenido, orden } = body

    const result = await sql`
      UPDATE home_blocks
      SET titulo = ${titulo}, descripcion = ${descripcion}, 
          tipo = ${tipo}, contenido = ${contenido}, orden = ${orden}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Bloque no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar bloque:", error)
    return NextResponse.json({ error: "Error al actualizar bloque" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de bloque requerido" }, { status: 400 })
  }

  try {
    const result = await sql`DELETE FROM home_blocks WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Bloque no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Bloque eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar bloque:", error)
    return NextResponse.json({ error: "Error al eliminar bloque" }, { status: 500 })
  }
}
