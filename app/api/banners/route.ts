// API para gestionar banners del tema
import { type NextRequest, NextResponse } from "next/server"
import { queryTheme } from "../db"

export async function GET() {
  try {
    const query = "SELECT * FROM banners ORDER BY orden ASC"
    const result = await queryTheme(query)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener banners:", error)
    return NextResponse.json({ error: "Error al obtener banners" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titulo, subtitulo, imagen_url, enlace, orden } = body

    // Validación básica
    if (!titulo || !imagen_url) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const query = `
      INSERT INTO banners (titulo, subtitulo, imagen_url, enlace, orden)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `

    const result = await queryTheme(query, [titulo, subtitulo, imagen_url, enlace, orden || 0])
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear banner:", error)
    return NextResponse.json({ error: "Error al crear banner" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, titulo, subtitulo, imagen_url, enlace, orden } = body

    if (!id) {
      return NextResponse.json({ error: "ID de banner requerido" }, { status: 400 })
    }

    const query = `
      UPDATE banners
      SET titulo = $1, subtitulo = $2, imagen_url = $3, enlace = $4, orden = $5
      WHERE id = $6
      RETURNING *
    `

    const result = await queryTheme(query, [titulo, subtitulo, imagen_url, enlace, orden, id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Banner no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error al actualizar banner:", error)
    return NextResponse.json({ error: "Error al actualizar banner" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de banner requerido" }, { status: 400 })
  }

  try {
    const query = "DELETE FROM banners WHERE id = $1 RETURNING *"
    const result = await queryTheme(query, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Banner no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Banner eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar banner:", error)
    return NextResponse.json({ error: "Error al eliminar banner" }, { status: 500 })
  }
}
