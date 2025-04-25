import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const events = await sql`SELECT * FROM eventos ORDER BY fecha_inicio DESC`
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error al obtener eventos:", error)
    return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { titulo, descripcion, fecha_inicio, fecha_fin } = body

    if (!titulo || !descripcion || !fecha_inicio || !fecha_fin) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin)
      VALUES (${titulo}, ${descripcion}, ${fecha_inicio}, ${fecha_fin})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear evento:", error)
    return NextResponse.json({ error: "Error al crear evento" }, { status: 500 })
  }
}
