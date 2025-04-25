import { sql } from "@/app/api/db"
import { NextResponse, type NextRequest } from "next/server"

async function queryTheme(query: string, values: any[]) {
  try {
    const result = await sql`${sql.raw(query)} ${sql.raw(values.map((v, i) => `$${i + 1}`).join(", "))}`
    return result
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  }
}

export async function GET() {
  try {
    const skaters = await sql`SELECT * FROM skaters ORDER BY nombre ASC`
    return NextResponse.json(skaters)
  } catch (error) {
    console.error("Error al obtener skaters:", error)
    return NextResponse.json({ error: "Error al obtener skaters" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, estilo, edad, ciudad, pais, biografia, logros, imagen_url } = body

    if (!nombre || !estilo || !ciudad || !pais || !biografia || !imagen_url) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO skaters (nombre, estilo, edad, ciudad, pais, biografia, logros, imagen_url)
      VALUES (${nombre}, ${estilo}, ${edad}, ${ciudad}, ${pais}, ${biografia}, ${logros}, ${imagen_url})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear skater:", error)
    return NextResponse.json({ error: "Error al crear skater" }, { status: 500 })
  }
}

// Actualizar un skater
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nombre, estilo, edad, ciudad, pais, biografia, logros, imagen_url } = body

    if (!id) {
      return NextResponse.json({ error: "ID de skater requerido" }, { status: 400 })
    }

    const query = `
      UPDATE skaters
      SET nombre = $1, estilo = $2, edad = $3, ciudad = $4, pais = $5, biografia = $6, logros = $7, imagen_url = $8
      WHERE id = $9
      RETURNING *
    `

    const result = await queryTheme(query, [nombre, estilo, edad, ciudad, pais, biografia, logros, imagen_url, id])

    if (!result || result.rows.length === 0) {
      return NextResponse.json({ error: "Skater no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error al actualizar skater:", error)
    return NextResponse.json({ error: "Error al actualizar skater" }, { status: 500 })
  }
}

// Eliminar un skater
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de skater requerido" }, { status: 400 })
  }

  try {
    const query = "DELETE FROM skaters WHERE id = $1 RETURNING *"
    const result = await queryTheme(query, [id])

    if (!result || result.rows.length === 0) {
      return NextResponse.json({ error: "Skater no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Skater eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar skater:", error)
    return NextResponse.json({ error: "Error al eliminar skater" }, { status: 500 })
  }
}
