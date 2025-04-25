import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"
import { generateHash } from "@/app/utils/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const user = await sql`SELECT id, nombre, email, rol FROM usuarios WHERE id = ${id}`

    if (user.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user[0])
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { nombre, email, password, rol } = body

    if (!nombre || !email) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // If password is provided, update it with a hash
    if (password) {
      const hashedPassword = generateHash(password)

      const result = await sql`
        UPDATE usuarios
        SET nombre = ${nombre}, email = ${email}, password = ${hashedPassword}, rol = ${rol}
        WHERE id = ${id}
        RETURNING id, nombre, email, rol
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
      }

      return NextResponse.json(result[0])
    } else {
      // Update without changing password
      const result = await sql`
        UPDATE usuarios
        SET nombre = ${nombre}, email = ${email}, rol = ${rol}
        WHERE id = ${id}
        RETURNING id, nombre, email, rol
      `

      if (result.length === 0) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
      }

      return NextResponse.json(result[0])
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await sql`DELETE FROM usuarios WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
