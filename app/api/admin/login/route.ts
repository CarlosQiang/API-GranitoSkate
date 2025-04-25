import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/app/api/db"
import { generateHash } from "@/app/utils/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password } = body

    if (!identifier || !password) {
      return NextResponse.json({ error: "Usuario/email y contraseña son requeridos" }, { status: 400 })
    }

    // Check if admin_users table exists
    try {
      // Try to find user by email or username
      const user = await sql`
        SELECT * FROM admin_users 
        WHERE email = ${identifier} OR username = ${identifier}
      `

      if (user.length === 0) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
      }

      // Simple password verification (in production use proper password comparison)
      const hashedPassword = generateHash(password)
      if (user[0].password_hash !== hashedPassword) {
        // Fallback to hardcoded passwords for backward compatibility
        const validPasswords = [process.env.ADMIN_PASSWORD || "granito2024", "admin123"]

        if (!validPasswords.includes(password)) {
          return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
        }
      }

      // Update last access timestamp
      await sql`
        UPDATE admin_users 
        SET ultimo_acceso = NOW() 
        WHERE id = ${user[0].id}
      `

      // Create session cookie
      const cookieStore = cookies()
      const adminSessionToken = process.env.ADMIN_SESSION_TOKEN || "granito_admin_session_token_secure_123456789"

      cookieStore.set({
        name: "admin_session",
        value: adminSessionToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      // Also store user info in another cookie for UI personalization
      cookieStore.set({
        name: "admin_user",
        value: JSON.stringify({
          id: user[0].id,
          username: user[0].username,
          nombre: user[0].nombre_completo,
          rol: user[0].rol,
        }),
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return NextResponse.json({
        success: true,
        message: "Inicio de sesión exitoso",
        user: {
          id: user[0].id,
          username: user[0].username,
          nombre: user[0].nombre_completo,
          rol: user[0].rol,
        },
      })
    } catch (error) {
      console.error("Error al verificar usuario en la base de datos:", error)

      // Fallback to hardcoded passwords if database query fails
      const validPasswords = [process.env.ADMIN_PASSWORD || "granito2024", "admin123"]

      if (validPasswords.includes(password)) {
        const cookieStore = cookies()
        const adminSessionToken = process.env.ADMIN_SESSION_TOKEN || "granito_admin_session_token_secure_123456789"

        cookieStore.set({
          name: "admin_session",
          value: adminSessionToken,
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })

        return NextResponse.json({ success: true, message: "Inicio de sesión exitoso (modo fallback)" })
      }

      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error en login de administrador:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
