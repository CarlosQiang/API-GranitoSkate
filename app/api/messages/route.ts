// API para gestionar mensajes de contacto
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

    const query = "SELECT * FROM mensajes WHERE usuario_id = $1 ORDER BY fecha_envio DESC"
    const result = await queryApp(query, [session.user.id])

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener mensajes:", error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { asunto, mensaje } = body

    // Validación básica
    if (!asunto || !mensaje) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const query = `
      INSERT INTO mensajes (usuario_id, asunto, mensaje)
      VALUES ($1, $2, $3)
      RETURNING *
    `

    const result = await queryApp(query, [session.user.id, asunto, mensaje])
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear mensaje:", error)
    return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 })
  }
}

// Endpoint para responder a mensajes (para administradores)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, respuesta_admin, admin_nombre } = body

    if (!id || !respuesta_admin || !admin_nombre) {
      return NextResponse.json({ error: "ID de mensaje, respuesta y nombre de admin son requeridos" }, { status: 400 })
    }

    // Actualizar mensaje
    const queryMsg = `
      UPDATE mensajes
      SET respuesta_admin = $1, estado = 'respondido'
      WHERE id = $2
      RETURNING *
    `
    const resultMsg = await queryApp(queryMsg, [respuesta_admin, id])

    if (resultMsg.rows.length === 0) {
      return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 })
    }

    // Registrar acción de administrador
    const queryAdmin = `
      INSERT INTO acciones_admin (admin_nombre, tipo_accion, detalles)
      VALUES ($1, $2, $3)
    `
    await queryApp(queryAdmin, [
      admin_nombre,
      "respuesta_mensaje",
      JSON.stringify({ mensaje_id: id, respuesta: respuesta_admin }),
    ])

    return NextResponse.json(resultMsg.rows[0])
  } catch (error) {
    console.error("Error al actualizar mensaje:", error)
    return NextResponse.json({ error: "Error al actualizar mensaje" }, { status: 500 })
  }
}
