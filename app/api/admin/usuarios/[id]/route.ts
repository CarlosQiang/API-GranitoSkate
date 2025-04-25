import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"
import * as bcrypt from "bcrypt"
import { verifyAdminRole } from "@/app/utils/auth"

export async function GET(request, { params }) {
  try {
    // Verificar que el usuario tiene rol de admin
    const authResult = await verifyAdminRole(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { id } = params

    const usuario = await sql`
      SELECT id, email, username, nombre_completo, rol, activo, ultimo_acceso, created_at
      FROM admin_users
      WHERE id = ${id}
    `

    if (usuario.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(usuario[0])
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    // Verificar que el usuario tiene rol de admin
    const authResult = await verifyAdminRole(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { id } = params
    const { email, username, password, nombre_completo, rol, activo } = await request.json()

    // Validar datos
    if (!email || !username || !rol) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Verificar si el usuario existe
    const existingUser = await sql`
      SELECT id FROM admin_users WHERE id = ${id}
    `

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Verificar si el email o username ya están en uso por otro usuario
    const duplicateCheck = await sql`
      SELECT id FROM admin_users 
      WHERE (email = ${email} OR username = ${username}) 
      AND id != ${id}
    `

    if (duplicateCheck.length > 0) {
      return NextResponse.json({ error: "El email o nombre de usuario ya están en uso" }, { status: 400 })
    }

    // Actualizar usuario
    if (password) {
      // Si se proporciona una nueva contraseña, actualizarla
      const passwordHash = await bcrypt.hash(password, 10)

      await sql`
        UPDATE admin_users
        SET email = ${email}, 
            username = ${username}, 
            password_hash = ${passwordHash}, 
            nombre_completo = ${nombre_completo}, 
            rol = ${rol}, 
            activo = ${activo}
        WHERE id = ${id}
      `
    } else {
      // Si no se proporciona contraseña, mantener la actual
      await sql`
        UPDATE admin_users
        SET email = ${email}, 
            username = ${username}, 
            nombre_completo = ${nombre_completo}, 
            rol = ${rol}, 
            activo = ${activo}
        WHERE id = ${id}
      `
    }

    // Obtener el usuario actualizado
    const updatedUser = await sql`
      SELECT id, email, username, nombre_completo, rol, activo, ultimo_acceso, created_at
      FROM admin_users
      WHERE id = ${id}
    `

    return NextResponse.json(updatedUser[0])
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // Verificar que el usuario tiene rol de admin
    const authResult = await verifyAdminRole(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { id } = params

    // Verificar que no es el usuario admin principal
    const userToDelete = await sql`
      SELECT username FROM admin_users WHERE id = ${id}
    `

    if (userToDelete.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    if (userToDelete[0].username === "admin") {
      return NextResponse.json({ error: "No se puede eliminar el usuario administrador principal" }, { status: 403 })
    }

    // Eliminar usuario
    await sql`
      DELETE FROM admin_users WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
