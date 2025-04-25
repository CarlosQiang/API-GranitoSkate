// API para gestionar preguntas frecuentes
import { type NextRequest, NextResponse } from "next/server"
import { queryTheme } from "../db"

export async function GET() {
  try {
    const query = "SELECT * FROM faq ORDER BY id ASC"
    const result = await queryTheme(query)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener FAQs:", error)
    return NextResponse.json({ error: "Error al obtener FAQs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pregunta, respuesta } = body

    // Validación básica
    if (!pregunta || !respuesta) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const query = `
      INSERT INTO faq (pregunta, respuesta)
      VALUES ($1, $2)
      RETURNING *
    `

    const result = await queryTheme(query, [pregunta, respuesta])
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear FAQ:", error)
    return NextResponse.json({ error: "Error al crear FAQ" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, pregunta, respuesta } = body

    if (!id) {
      return NextResponse.json({ error: "ID de FAQ requerido" }, { status: 400 })
    }

    const query = `
      UPDATE faq
      SET pregunta = $1, respuesta = $2
      WHERE id = $3
      RETURNING *
    `

    const result = await queryTheme(query, [pregunta, respuesta, id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "FAQ no encontrada" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error al actualizar FAQ:", error)
    return NextResponse.json({ error: "Error al actualizar FAQ" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de FAQ requerido" }, { status: 400 })
  }

  try {
    const query = "DELETE FROM faq WHERE id = $1 RETURNING *"
    const result = await queryTheme(query, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "FAQ no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "FAQ eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar FAQ:", error)
    return NextResponse.json({ error: "Error al eliminar FAQ" }, { status: 500 })
  }
}
