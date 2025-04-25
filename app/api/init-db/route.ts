import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"
import { generateHash } from "@/app/utils/auth"

export async function GET() {
  try {
    // Check if admin_users table exists
    try {
      await sql`SELECT 1 FROM admin_users LIMIT 1`
      return NextResponse.json({ message: "La tabla admin_users ya existe" })
    } catch (error) {
      console.log("Creando tabla admin_users...")

      // Create admin_users table
      await sql`
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          nombre_completo TEXT NOT NULL,
          rol TEXT NOT NULL DEFAULT 'editor',
          activo BOOLEAN DEFAULT TRUE,
          ultimo_acceso TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Create default admin user
      const defaultPassword = "admin123"
      const passwordHash = generateHash(defaultPassword)

      await sql`
        INSERT INTO admin_users (username, email, password_hash, nombre_completo, rol)
        VALUES ('admin', 'admin@granitoskate.com', ${passwordHash}, 'Administrador Principal', 'admin')
      `

      return NextResponse.json({
        message: "Tabla admin_users creada e inicializada correctamente",
        defaultCredentials: {
          username: "admin",
          email: "admin@granitoskate.com",
          password: defaultPassword,
        },
      })
    }
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return NextResponse.json({ error: "Error al inicializar la base de datos" }, { status: 500 })
  }
}
