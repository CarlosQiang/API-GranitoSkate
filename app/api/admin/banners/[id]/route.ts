import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de banner requerido" }, { status: 400 })
  }

  try {
    const banner = await sql`SELECT * FROM banners WHERE id = ${id}`

    if (banner.length === 0) {
      return NextResponse.json({ error: "Banner no encontrado" }, { status: 404 })
    }

    return NextResponse.json(banner[0])
  } catch (error) {
    console.error("Error al obtener banner:", error)
    return NextResponse.json({ error: "Error al obtener banner" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de banner requerido" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { titulo, subtitulo, imagen_url, enlace, orden } = body

    const result = await sql`
      UPDATE banners
      SET titulo = ${titulo}, subtitulo = ${subtitulo}, imagen_url = ${imagen_url}, enlace = ${enlace}, orden = ${orden}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Banner no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar banner:", error)
    return NextResponse.json({ error: "Error al actualizar banner" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de banner requerido" }, { status: 400 })
  }

  try {
    const result = await sql`DELETE FROM banners WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Banner no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Banner eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar banner:", error)
    return NextResponse.json({ error: "Error al eliminar banner" }, { status: 500 })
  }
}
