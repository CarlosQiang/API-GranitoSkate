// API para gestionar reseñas de productos
import { type NextRequest, NextResponse } from "next/server"
import { queryTheme } from "../db"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("id_producto")

  try {
    let query = "SELECT * FROM resenas"
    const params: any[] = []

    if (productId) {
      query += " WHERE id_producto = $1"
      params.push(productId)
    }

    query += " ORDER BY fecha_creacion DESC"

    const result = await queryTheme(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener reseñas:", error)
    return NextResponse.json({ error: "Error al obtener reseñas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre_cliente, id_producto, valoracion, comentario } = body

    // Validación básica
    if (!nombre_cliente || !id_producto || !valoracion) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const query = `
      INSERT INTO resenas (nombre_cliente, id_producto, valoracion, comentario)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `

    const result = await queryTheme(query, [nombre_cliente, id_producto, valoracion, comentario])
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear reseña:", error)
    return NextResponse.json({ error: "Error al crear reseña" }, { status: 500 })
  }
}
