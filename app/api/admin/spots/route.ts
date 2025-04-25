import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const spots = await sql`SELECT * FROM spots ORDER BY nombre ASC`
    return NextResponse.json(spots)
  } catch (error) {
    console.error("Error al obtener spots:", error)
    return NextResponse.json({ error: "Error al obtener spots" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, tipo, ciudad, direccion, descripcion, mapa_iframe, imagen_url } = body

    if (!nombre || !tipo || !ciudad || !direccion || !descripcion || !imagen_url) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO spots (nombre, tipo, ciudad, direccion, descripcion, mapa_iframe, imagen_url)
      VALUES (${nombre}, ${tipo}, ${ciudad}, ${direccion}, ${descripcion}, ${mapa_iframe}, ${imagen_url})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear spot:", error)
    return NextResponse.json({ error: "Error al crear spot" }, { status: 500 })
  }
}
