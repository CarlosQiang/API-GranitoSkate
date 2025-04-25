import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/app/api/db"

// Obtener todos los banners
export async function GET() {
  try {
    const banners = await sql`SELECT * FROM banners ORDER BY orden ASC`
    return NextResponse.json(banners)
  } catch (error) {
    console.error("Error al obtener banners:", error)
    return NextResponse.json({ error: "Error al obtener banners" }, { status: 500 })
  }
}

// Crear un nuevo banner
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { titulo, imagen_url, enlace, orden } = body

    if (!titulo || !imagen_url || !enlace) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO banners (titulo, imagen_url, enlace, orden)
      VALUES (${titulo}, ${imagen_url}, ${enlace}, ${orden})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear banner:", error)
    return NextResponse.json({ error: "Error al crear banner" }, { status: 500 })
  }
}

// Eliminar un banner
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

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
