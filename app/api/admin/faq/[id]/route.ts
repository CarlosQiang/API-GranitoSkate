import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de FAQ requerido" }, { status: 400 })
  }

  try {
    const faq = await sql`SELECT * FROM faq WHERE id = ${id}`

    if (faq.length === 0) {
      return NextResponse.json({ error: "FAQ no encontrado" }, { status: 404 })
    }

    return NextResponse.json(faq[0])
  } catch (error) {
    console.error("Error al obtener FAQ:", error)
    return NextResponse.json({ error: "Error al obtener FAQ" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de FAQ requerido" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { pregunta, respuesta } = body

    const result = await sql`
      UPDATE faq
      SET pregunta = ${pregunta}, respuesta = ${respuesta}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "FAQ no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar FAQ:", error)
    return NextResponse.json({ error: "Error al actualizar FAQ" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de FAQ requerido" }, { status: 400 })
  }

  try {
    const result = await sql`DELETE FROM faq WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "FAQ no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "FAQ eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar FAQ:", error)
    return NextResponse.json({ error: "Error al eliminar FAQ" }, { status: 500 })
  }
}
