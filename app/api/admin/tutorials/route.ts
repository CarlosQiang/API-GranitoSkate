import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const tutorials = await sql`SELECT * FROM tutoriales ORDER BY titulo ASC`
    return NextResponse.json(tutorials)
  } catch (error) {
    console.error("Error al obtener tutoriales:", error)
    return NextResponse.json({ error: "Error al obtener tutoriales" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { titulo, descripcion, nivel, video_url, imagen_url, contenido } = body

    if (!titulo || !descripcion || !nivel || !video_url || !imagen_url || !contenido) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO tutoriales (titulo, descripcion, nivel, video_url, imagen_url, contenido)
      VALUES (${titulo}, ${descripcion}, ${nivel}, ${video_url}, ${imagen_url}, ${contenido})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear tutorial:", error)
    return NextResponse.json({ error: "Error al crear tutorial" }, { status: 500 })
  }
}
