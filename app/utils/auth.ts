import { cookies } from "next/headers"
import * as jwt from "jsonwebtoken"
import { sql } from "@/app/api/db"

export async function verifyAdminRole(request) {
  try {
    const cookieStore = cookies()
    const adminSession = cookieStore.get("admin_session")

    if (!adminSession) {
      return { success: false, error: "No autenticado", status: 401 }
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
      }

      // Verificar que el usuario existe y está activo
      const userResult = await sql`
        SELECT * FROM admin_users 
        WHERE id = ${decoded.id} AND activo = true
      `

      if (userResult.length === 0) {
        return { success: false, error: "Usuario no encontrado o inactivo", status: 401 }
      }

      // Verificar que el usuario tiene rol de admin
      if (decoded.rol !== "admin") {
        return { success: false, error: "Acceso denegado. Se requiere rol de administrador", status: 403 }
      }

      return { success: true, user: decoded }
    } catch (error) {
      console.error("Error al verificar token:", error)
      return { success: false, error: "Token inválido", status: 401 }
    }
  } catch (error) {
    console.error("Error en verificación de administrador:", error)
    return { success: false, error: "Error al procesar la solicitud", status: 500 }
  }
}
