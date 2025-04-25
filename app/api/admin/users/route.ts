import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"
import { generateHash } from "@/app/utils/auth"

// Get all admin users
export async function GET() {
  try {
    const users = await sql`
      SELECT id, username, email, nombre_completo, rol, activo, ultimo_acceso, created_at
      FROM admin_users 
      ORDER BY created_at DESC
    `
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

// Create a new admin user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, nombre_completo, rol } = body

    if (!username || !email || !password || !nombre_completo) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Check if username or email already exists
    const existingUser = await sql`
      SELECT id FROM admin_users WHERE username = ${username} OR email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "El nombre de usuario o email ya está en uso" }, { status: 400 })
    }

    // Hash password
    const password_hash = generateHash(password)

    // Insert new user
    const result = await sql`
      INSERT INTO admin_users (username, email, password_hash, nombre_completo, rol, activo)
      VALUES (${username}, ${email}, ${password_hash}, ${nombre_completo}, ${rol || "editor"}, ${true})
      RETURNING id, username, email, nombre_completo, rol, activo, created_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
