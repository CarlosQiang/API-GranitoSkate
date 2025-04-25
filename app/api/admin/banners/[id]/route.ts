import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
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
  try {
    const id = params.id
    const body = await request.json()
    const { titulo, imagen_url, enlace, orden } = body

    if (!titulo || !imagen_url || !enlace) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      UPDATE banners
      SET titulo = ${titulo}, imagen_url = ${imagen_url}, enlace = ${enlace}, orden = ${orden}
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
  try {
    const id = params.id
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
