import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar la cookie de sesión
    const cookieStore = cookies()
    const adminSession = cookieStore.get("admin_session")
    const adminSessionToken = process.env.ADMIN_SESSION_TOKEN || "granito_admin_session_token_secure_123456789"

    if (!adminSession || adminSession.value !== adminSessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error("Error al verificar autenticación:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
