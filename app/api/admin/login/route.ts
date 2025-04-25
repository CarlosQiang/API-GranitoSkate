import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/app/api/db"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Buscar usuario por email o username
    const userResult = await sql`
      SELECT * FROM admin_users 
      WHERE (email = ${email} OR username = ${email}) AND activo = true
    `

    const user = userResult[0]

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado o inactivo" }, { status: 401 })
    }

    // Si es el usuario admin con la contraseña predeterminada
    if (user.username === "admin" && password === "GranitoSkate") {
      // Generar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          rol: user.rol,
          nombre: user.nombre_completo,
        },
        process.env.ADMIN_SESSION_TOKEN || "granito_admin_session_token_secure_123456789",
        { expiresIn: "7d" },
      )

      // Actualizar último acceso
      await sql`
        UPDATE admin_users 
        SET ultimo_acceso = CURRENT_TIMESTAMP 
        WHERE id = ${user.id}
      `

      // Establecer la cookie de sesión
      cookies().set({
        name: "admin_session",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 semana
      })

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          nombre: user.nombre_completo,
          rol: user.rol,
        },
      })
    }

    // Para otros usuarios, verificar contraseña con bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        rol: user.rol,
        nombre: user.nombre_completo,
      },
      process.env.ADMIN_SESSION_TOKEN || "granito_admin_session_token_secure_123456789",
      { expiresIn: "7d" },
    )

    // Actualizar último acceso
    await sql`
      UPDATE admin_users 
      SET ultimo_acceso = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `

    // Establecer la cookie de sesión
    cookies().set({
      name: "admin_session",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        nombre: user.nombre_completo,
        rol: user.rol,
      },
    })
  } catch (error) {
    console.error("Error en login de administrador:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
