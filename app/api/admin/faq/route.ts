import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const faqs = await sql`SELECT * FROM faq ORDER BY id ASC`
    return NextResponse.json(faqs)
  } catch (error) {
    console.error("Error al obtener FAQs:", error)
    return NextResponse.json({ error: "Error al obtener FAQs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pregunta, respuesta } = body

    if (!pregunta || !respuesta) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO faq (pregunta, respuesta)
      VALUES (${pregunta}, ${respuesta})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear FAQ:", error)
    return NextResponse.json({ error: "Error al crear FAQ" }, { status: 500 })
  }
}
