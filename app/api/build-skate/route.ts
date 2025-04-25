// API para gestionar builds de skates personalizados
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

    const query = "SELECT * FROM build_skates WHERE usuario_id = $1 ORDER BY fecha_creacion DESC"
    const result = await queryApp(query, [session.user.id])

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener builds:", error)
    return NextResponse.json({ error: "Error al obtener builds" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { nombre_build, tabla_id, ruedas_id, ejes_id, grip_id, otros_componentes } = body

    // Validación básica
    if (!nombre_build || !tabla_id) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const query = `
      INSERT INTO build_skates (usuario_id, nombre_build, tabla_id, ruedas_id, ejes_id, grip_id, otros_componentes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

    const result = await queryApp(query, [
      session.user.id,
      nombre_build,
      tabla_id,
      ruedas_id,
      ejes_id,
      grip_id,
      otros_componentes || {},
    ])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear build:", error)
    return NextResponse.json({ error: "Error al crear build" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { id, nombre_build, tabla_id, ruedas_id, ejes_id, grip_id, otros_componentes } = body

    if (!id) {
      return NextResponse.json({ error: "ID de build requerido" }, { status: 400 })
    }

    // Verificar que el build pertenece al usuario
    const checkQuery = "SELECT * FROM build_skates WHERE id = $1 AND usuario_id = $2"
    const checkResult = await queryApp(checkQuery, [id, session.user.id])

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Build no encontrado o no autorizado" }, { status: 404 })
    }

    const query = `
      UPDATE build_skates
      SET nombre_build = $1, tabla_id = $2, ruedas_id = $3, ejes_id = $4, grip_id = $5, otros_componentes = $6
      WHERE id = $7 AND usuario_id = $8
      RETURNING *
    `

    const result = await queryApp(query, [
      nombre_build,
      tabla_id,
      ruedas_id,
      ejes_id,
      grip_id,
      otros_componentes || {},
      id,
      session.user.id,
    ])

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error al actualizar build:", error)
    return NextResponse.json({ error: "Error al actualizar build" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de build requerido" }, { status: 400 })
  }

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const query = "DELETE FROM build_skates WHERE id = $1 AND usuario_id = $2 RETURNING *"
    const result = await queryApp(query, [id, session.user.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Build no encontrado o no autorizado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Build eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar build:", error)
    return NextResponse.json({ error: "Error al eliminar build" }, { status: 500 })
  }
}
