// API para gestionar la lista de favoritos
import { type NextRequest, NextResponse } from "next/server"
import { queryApp } from "../db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const query = "SELECT * FROM favoritos WHERE usuario_id = $1 ORDER BY fecha_agregado DESC"
    const result = await queryApp(query, [session.user.id])

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener favoritos:", error)
    return NextResponse.json({ error: "Error al obtener favoritos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { id_producto, nombre_producto } = body

    // Validación básica
    if (!id_producto || !nombre_producto) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Verificar si ya existe en favoritos
    const checkQuery = "SELECT * FROM favoritos WHERE usuario_id = $1 AND id_producto = $2"
    const checkResult = await queryApp(checkQuery, [session.user.id, id_producto])

    if (checkResult.rows.length > 0) {
      return NextResponse.json({ message: "Producto ya en favoritos" })
    }

    const query = `
      INSERT INTO favoritos (usuario_id, id_producto, nombre_producto)
      VALUES ($1, $2, $3)
      RETURNING *
    `

    const result = await queryApp(query, [session.user.id, id_producto, nombre_producto])
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al añadir a favoritos:", error)
    return NextResponse.json({ error: "Error al añadir a favoritos" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("id_producto")

  if (!productId) {
    return NextResponse.json({ error: "ID de producto requerido" }, { status: 400 })
  }

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const query = "DELETE FROM favoritos WHERE usuario_id = $1 AND id_producto = $2 RETURNING *"
    const result = await queryApp(query, [session.user.id, productId])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado en favoritos" }, { status: 404 })
    }

    return NextResponse.json({ message: "Producto eliminado de favoritos" })
  } catch (error) {
    console.error("Error al eliminar de favoritos:", error)
    return NextResponse.json({ error: "Error al eliminar de favoritos" }, { status: 500 })
  }
}
