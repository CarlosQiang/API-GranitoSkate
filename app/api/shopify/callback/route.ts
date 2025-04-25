import { NextResponse, type NextRequest } from "next/server"
import { queryApp } from "../../db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shop = searchParams.get("shop")
    const code = searchParams.get("code")

    if (!shop || !code) {
      return NextResponse.json({ error: "Parámetros insuficientes" }, { status: 400 })
    }

    // Intercambiar el código por un token de acceso permanente
    const accessTokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    })

    if (!accessTokenResponse.ok) {
      throw new Error(`Error al obtener token: ${accessTokenResponse.statusText}`)
    }

    const { access_token } = await accessTokenResponse.json()

    // Guardar el token en la base de datos
    await queryApp(
      "INSERT INTO shopify_tokens (shop, access_token) VALUES ($1, $2) ON CONFLICT (shop) DO UPDATE SET access_token = $2",
      [shop, access_token],
    )

    // Redirigir al panel de administración
    return NextResponse.redirect(`${process.env.SHOPIFY_APP_URL}/admin?shop=${shop}`)
  } catch (error) {
    console.error("Error en callback de Shopify:", error)
    return NextResponse.json({ error: "Error en el proceso de autenticación" }, { status: 500 })
  }
}
