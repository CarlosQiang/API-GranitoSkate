import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"
import { sql } from "@/app/api/db"

export async function GET() {
  try {
    const cookieStore = cookies()
    const adminSession = cookieStore.get("admin_session")

    if (!adminSession) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
      // Verificar el token JWT
      const token = adminSession.value
      const secretKey = process.env.ADMIN_SESSION_TOKEN || "granito_admin_session_token_secure_123456789"

      const decoded = jwt.verify(token, secretKey) as {
        id: number
        email: string
        username: string
        rol: string
        nombre: string
      }

      // Verificar que el usuario existe y está activo
      const userResult = await sql`
        SELECT * FROM admin_users 
        WHERE id = ${decoded.id} AND activo = true
      `

      if (userResult.length === 0) {
        return NextResponse.json({ authenticated: false, error: "Usuario no encontrado o inactivo" }, { status: 401 })
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
          nombre: decoded.nombre,
          rol: decoded.rol,
        },
      })
    } catch (error) {
      console.error("Error al verificar token:", error)
      return NextResponse.json({ authenticated: false, error: "Token inválido" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error en verificación de administrador:", error)
    return NextResponse.json({ authenticated: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
