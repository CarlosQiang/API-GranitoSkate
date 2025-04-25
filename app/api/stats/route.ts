// API para registrar estadísticas de visitas
import { type NextRequest, NextResponse } from "next/server"
import { queryApp } from "../db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id_producto } = body

    // Validación básica
    if (!id_producto) {
      return NextResponse.json({ error: "Falta ID de producto" }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    const usuario_id = session?.user?.id || null

    const query = `
      INSERT INTO visitas (usuario_id, id_producto)
      VALUES ($1, $2)
      RETURNING *
    `

    const result = await queryApp(query, [usuario_id, id_producto])
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al registrar visita:", error)
    return NextResponse.json({ error: "Error al registrar visita" }, { status: 500 })
  }
}

// Endpoint para obtener estadísticas (para administradores)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("id_producto")
  const startDate = searchParams.get("fecha_inicio")
  const endDate = searchParams.get("fecha_fin")

  try {
    let query = "SELECT id_producto, COUNT(*) as visitas FROM visitas"
    const params: any[] = []
    let paramIndex = 1
    let whereAdded = false

    if (productId) {
      query += " WHERE id_producto = $" + paramIndex++
      params.push(productId)
      whereAdded = true
    }

    if (startDate) {
      query += whereAdded ? " AND" : " WHERE"
      query += " fecha_visita >= $" + paramIndex++
      params.push(startDate)
      whereAdded = true
    }

    if (endDate) {
      query += whereAdded ? " AND" : " WHERE"
      query += " fecha_visita <= $" + paramIndex++
      params.push(endDate)
    }

    query += " GROUP BY id_producto ORDER BY visitas DESC"

    const result = await queryApp(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
