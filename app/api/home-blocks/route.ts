// API para gestionar bloques de la página de inicio
import { type NextRequest, NextResponse } from "next/server"
import { queryTheme } from "../db"

export async function GET() {
  try {
    const query = "SELECT * FROM home_blocks ORDER BY orden ASC"
    const result = await queryTheme(query)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener bloques de inicio:", error)
    return NextResponse.json({ error: "Error al obtener bloques de inicio" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titulo, descripcion, tipo, contenido, orden } = body

    // Validación básica
    if (!titulo || !tipo) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const query = `
      INSERT INTO home_blocks (titulo, descripcion, tipo, contenido, orden)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `

    const result = await queryTheme(query, [titulo, descripcion, tipo, contenido, orden || 0])
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear bloque de inicio:", error)
    return NextResponse.json({ error: "Error al crear bloque de inicio" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, titulo, descripcion, tipo, contenido, orden } = body

    if (!id) {
      return NextResponse.json({ error: "ID de bloque requerido" }, { status: 400 })
    }

    const query = `
      UPDATE home_blocks
      SET titulo = $1, descripcion = $2, tipo = $3, contenido = $4, orden = $5
      WHERE id = $6
      RETURNING *
    `

    const result = await queryTheme(query, [titulo, descripcion, tipo, contenido, orden, id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Bloque no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error al actualizar bloque de inicio:", error)
    return NextResponse.json({ error: "Error al actualizar bloque de inicio" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de bloque requerido" }, { status: 400 })
  }

  try {
    const query = "DELETE FROM home_blocks WHERE id = $1 RETURNING *"
    const result = await queryTheme(query, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Bloque no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Bloque eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar bloque de inicio:", error)
    return NextResponse.json({ error: "Error al eliminar bloque de inicio" }, { status: 500 })
  }
}
