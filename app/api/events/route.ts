// API para gestionar eventos y promociones
import { type NextRequest, NextResponse } from "next/server"
import { queryTheme } from "../db"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const active = searchParams.get("activos")

  try {
    let query = "SELECT * FROM eventos"
    const params: any[] = []

    if (active === "true") {
      // Solo eventos activos (fecha actual entre fecha_inicio y fecha_fin)
      query += " WHERE CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin"
    }

    query += " ORDER BY fecha_inicio"

    const result = await queryTheme(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener eventos:", error)
    return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titulo, descripcion, fecha_inicio, fecha_fin } = body

    // Validación básica
    if (!titulo || !fecha_inicio || !fecha_fin) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const query = `
      INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `

    const result = await queryTheme(query, [titulo, descripcion, fecha_inicio, fecha_fin])
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear evento:", error)
    return NextResponse.json({ error: "Error al crear evento" }, { status: 500 })
  }
}
