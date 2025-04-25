import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Redireccionar /api a /api/docs
  if (request.nextUrl.pathname === "/api") {
    return NextResponse.redirect(new URL("/api/docs", request.url))
  }

  // Verificar si la ruta es para el panel de administración
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Verificar si es la página de login
    if (request.nextUrl.pathname === "/admin/login") {
      // Verificar si ya hay una sesión válida
      const adminSession = request.cookies.get("admin_session")
      const adminSessionToken = process.env.ADMIN_SESSION_TOKEN || "granito_admin_session_token_secure_123456789"

      // Si ya hay una sesión válida, redirigir al dashboard
      if (adminSession && adminSession.value === adminSessionToken) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }

      return NextResponse.next()
    }

    // Verificar si hay una cookie de sesión de administrador
    const adminSession = request.cookies.get("admin_session")
    const adminSessionToken = process.env.ADMIN_SESSION_TOKEN || "granito_admin_session_token_secure_123456789"

    if (!adminSession || adminSession.value !== adminSessionToken) {
      // Redirigir al login si no hay sesión válida
      console.log("Sesión no válida, redirigiendo a login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Verificar si la ruta es una API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Permitir solicitudes de webhook sin autenticación
    if (
      request.nextUrl.pathname === "/api/shopify-webhook" ||
      request.nextUrl.pathname === "/api/auth" ||
      request.nextUrl.pathname.startsWith("/api/auth/") ||
      request.nextUrl.pathname === "/api/admin/login" ||
      request.nextUrl.pathname === "/api/docs"
    ) {
      return NextResponse.next()
    }

    // Rutas públicas que no requieren autenticación
    const publicRoutes = ["/api/reviews", "/api/events", "/api/banners", "/api/faq", "/api/home-blocks"]

    // Si es una ruta pública y es GET, permitir sin autenticación
    if (publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) && request.method === "GET") {
      return NextResponse.next()
    }

    // Para rutas de administración, verificar la cookie de sesión de administrador
    if (request.nextUrl.pathname.startsWith("/api/admin")) {
      const adminSession = request.cookies.get("admin_session")
      const adminSessionToken = process.env.ADMIN_SESSION_TOKEN || "granito_admin_session_token_secure_123456789"

      if (!adminSession || adminSession.value !== adminSessionToken) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
      }

      return NextResponse.next()
    }

    // Para otras rutas de API, verificar autenticación con API key
    const apiKey = request.headers.get("x-api-key")
    if (apiKey && apiKey !== process.env.SHOPIFY_API_SECRET) {
      return NextResponse.json({ error: "API key inválida" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: ["/api", "/api/:path*", "/admin/:path*"],
}
