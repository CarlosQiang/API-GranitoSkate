import { NextResponse, type NextRequest } from "next/server"
import crypto from "crypto"

// Función para verificar la firma de Shopify
function verifyShopifyRequest(query: URLSearchParams) {
  const { shop, timestamp, hmac, ...params } = Object.fromEntries(query.entries())

  if (!shop || !timestamp || !hmac) {
    return false
  }

  // Ordenar los parámetros alfabéticamente
  const message = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&")

  // Calcular el HMAC
  const calculatedHmac = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET || "")
    .update(message)
    .digest("hex")

  // Comparar el HMAC calculado con el recibido
  return crypto.timingSafeEqual(Buffer.from(calculatedHmac), Buffer.from(hmac))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Verificar si es una solicitud de instalación
    if (searchParams.has("shop")) {
      const shop = searchParams.get("shop")

      // Verificar que el dominio sea de Shopify
      if (!shop || !shop.endsWith(".myshopify.com")) {
        return NextResponse.json({ error: "Dominio de tienda inválido" }, { status: 400 })
      }

      // Si es una solicitud de OAuth, redirigir a Shopify para autorización
      if (searchParams.has("hmac")) {
        // Verificar la firma de Shopify
        if (!verifyShopifyRequest(searchParams)) {
          return NextResponse.json({ error: "Firma inválida" }, { status: 401 })
        }

        // Construir la URL de autorización de Shopify
        const redirectUri = `${process.env.SHOPIFY_APP_URL}/api/shopify/callback`
        const scopes = "read_products,write_products,read_customers,write_customers,read_orders,write_orders"

        const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${
          process.env.SHOPIFY_API_KEY
        }&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`

        return NextResponse.redirect(authUrl)
      }

      // Si es una solicitud inicial, redirigir a la página de instalación
      const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${
        process.env.SHOPIFY_API_KEY
      }&scope=read_products,write_products,read_customers,write_customers,read_orders,write_orders&redirect_uri=${encodeURIComponent(
        `${process.env.SHOPIFY_APP_URL}/api/shopify/callback`,
      )}`

      return NextResponse.redirect(installUrl)
    }

    return NextResponse.json({ error: "Parámetros insuficientes" }, { status: 400 })
  } catch (error) {
    console.error("Error en autenticación de Shopify:", error)
    return NextResponse.json({ error: "Error en la autenticación" }, { status: 500 })
  }
}
