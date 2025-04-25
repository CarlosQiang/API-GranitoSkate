import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"
import { generateHash } from "@/app/utils/auth"

// Get a specific admin user
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const user = await sql`
      SELECT id, username, email, nombre_completo, rol, activo, ultimo_acceso, created_at
      FROM admin_users 
      WHERE id = ${id}
    `

    if (user.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user[0])
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

// Update an admin user
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { username, email, password, nombre_completo, rol, activo } = body

    if (!username || !email || !nombre_completo) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Check if username or email already exists for other users
    const existingUser = await sql`
      SELECT id FROM admin_users 
      WHERE (username = ${username} OR email = ${email}) AND id != ${id}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "El nombre de usuario o email ya está en uso" }, { status: 400 })
    }

    let result

    // If password is provided, update it too
    if (password) {
      const password_hash = generateHash(password)
      result = await sql`
        UPDATE admin_users
        SET username = ${username}, 
            email = ${email}, 
            password_hash = ${password_hash}, 
            nombre_completo = ${nombre_completo}, 
            rol = ${rol},
            activo = ${activo}
        WHERE id = ${id}
        RETURNING id, username, email, nombre_completo, rol, activo, ultimo_acceso, created_at
      `
    } else {
      // Update without changing password
      result = await sql`
        UPDATE admin_users
        SET username = ${username}, 
            email = ${email}, 
            nombre_completo = ${nombre_completo}, 
            rol = ${rol},
            activo = ${activo}
        WHERE id = ${id}
        RETURNING id, username, email, nombre_completo, rol, activo, ultimo_acceso, created_at
      `
    }

    if (result.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

// Delete an admin user
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Prevent deleting the last admin
    const adminCount = await sql`SELECT COUNT(*) FROM admin_users WHERE rol = 'admin'`
    const user = await sql`SELECT rol FROM admin_users WHERE id = ${id}`

    if (user.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    if (user[0].rol === "admin" && Number(adminCount[0].count) <= 1) {
      return NextResponse.json({ error: "No se puede eliminar el último administrador" }, { status: 400 })
    }

    const result = await sql`DELETE FROM admin_users WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
