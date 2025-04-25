import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const homeBlocks = await sql`SELECT * FROM home_blocks ORDER BY orden ASC`
    return NextResponse.json(homeBlocks)
  } catch (error) {
    console.error("Error al obtener bloques de inicio:", error)
    return NextResponse.json({ error: "Error al obtener bloques de inicio" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { titulo, descripcion, tipo, contenido, orden } = body

    if (!titulo || !descripcion || !tipo || !contenido) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO home_blocks (titulo, descripcion, tipo, contenido, orden)
      VALUES (${titulo}, ${descripcion}, ${tipo}, ${contenido}, ${orden})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear bloque de inicio:", error)
    return NextResponse.json({ error: "Error al crear bloque de inicio" }, { status: 500 })
  }
}
