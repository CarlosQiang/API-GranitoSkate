// API para gestionar encuestas post-compra
import { type NextRequest, NextResponse } from "next/server"
import { queryApp } from "../db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get("id_pedido")

  try {
    let query = "SELECT * FROM encuestas"
    const params: any[] = []

    if (orderId) {
      query += " WHERE id_pedido = $1"
      params.push(orderId)
    }

    query += " ORDER BY fecha_creacion DESC"

    const result = await queryApp(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener encuestas:", error)
    return NextResponse.json({ error: "Error al obtener encuestas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { id_pedido, satisfaccion, comentario } = body

    // Validación básica
    if (!id_pedido || !satisfaccion) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const query = `
      INSERT INTO encuestas (usuario_id, id_pedido, satisfaccion, comentario)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `

    const result = await queryApp(query, [session.user.id, id_pedido, satisfaccion, comentario])
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear encuesta:", error)
    return NextResponse.json({ error: "Error al crear encuesta" }, { status: 500 })
  }
}
