import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname

    // Rutas públicas que no requieren autenticación
    const publicPaths = ["/admin/login", "/api/admin/login", "/api/admin/verify"]

    // Si es una ruta pública, permitir acceso
    if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
      return NextResponse.next()
    }

    // Verificar si es una ruta de administración
    if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
      const token = request.cookies.get("admin_token")?.value

      // Si no hay token, redirigir al login
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      // Si hay token, permitir acceso
      return NextResponse.next()
    }

    // Para todas las demás rutas, permitir acceso
    return NextResponse.next()
  } catch (error) {
    console.error("Error en middleware:", error)
    // En caso de error, permitir la solicitud para no bloquear el despliegue
    return NextResponse.next()
  }
}

// Configurar las rutas que deben usar el middleware
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
