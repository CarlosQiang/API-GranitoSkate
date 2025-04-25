import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"
import * as bcrypt from "bcrypt"
import { verifyAdminRole } from "@/app/utils/auth"

export async function GET(request) {
  try {
    // Verificar que el usuario tiene rol de admin
    const authResult = await verifyAdminRole(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const usuarios = await sql`
      SELECT id, email, username, nombre_completo, rol, activo, ultimo_acceso, created_at
      FROM admin_users
      ORDER BY created_at DESC
    `

    return NextResponse.json(usuarios)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Verificar que el usuario tiene rol de admin
    const authResult = await verifyAdminRole(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { email, username, password, nombre_completo, rol } = await request.json()

    // Validar datos
    if (!email || !username || !password || !rol) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Verificar si el email o username ya existen
    const existingUser = await sql`
      SELECT id FROM admin_users WHERE email = ${email} OR username = ${username}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "El email o nombre de usuario ya están en uso" }, { status: 400 })
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // Insertar nuevo usuario
    const result = await sql`
      INSERT INTO admin_users (email, username, password_hash, nombre_completo, rol)
      VALUES (${email}, ${username}, ${passwordHash}, ${nombre_completo}, ${rol})
      RETURNING id, email, username, nombre_completo, rol, activo, created_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
