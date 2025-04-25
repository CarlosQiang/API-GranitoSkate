import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const homeBlock = await sql`SELECT * FROM home_blocks WHERE id = ${id}`

    if (homeBlock.length === 0) {
      return NextResponse.json({ error: "Bloque de inicio no encontrado" }, { status: 404 })
    }

    return NextResponse.json(homeBlock[0])
  } catch (error) {
    console.error("Error al obtener bloque de inicio:", error)
    return NextResponse.json({ error: "Error al obtener bloque de inicio" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { titulo, descripcion, tipo, contenido, orden } = body

    if (!titulo || !descripcion || !tipo || !contenido) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      UPDATE home_blocks
      SET titulo = ${titulo}, descripcion = ${descripcion}, 
          tipo = ${tipo}, contenido = ${contenido}, orden = ${orden}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Bloque de inicio no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar bloque de inicio:", error)
    return NextResponse.json({ error: "Error al actualizar bloque de inicio" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await sql`DELETE FROM home_blocks WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Bloque de inicio no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Bloque de inicio eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar bloque de inicio:", error)
    return NextResponse.json({ error: "Error al eliminar bloque de inicio" }, { status: 500 })
  }
}
