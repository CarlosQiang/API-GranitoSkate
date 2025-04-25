import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"
import { generateHash } from "@/app/utils/auth"

// Get all users
export async function GET() {
  try {
    const users = await sql`SELECT id, nombre, email, rol FROM usuarios ORDER BY nombre ASC`
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

// Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, password, rol } = body

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Simple password hashing
    const hashedPassword = generateHash(password)

    const result = await sql`
      INSERT INTO usuarios (nombre, email, password, rol)
      VALUES (${nombre}, ${email}, ${hashedPassword}, ${rol || "editor"})
      RETURNING id, nombre, email, rol
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
