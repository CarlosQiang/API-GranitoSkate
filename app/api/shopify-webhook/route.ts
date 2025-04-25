// Webhook para recibir eventos de Shopify
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { queryApp } from "../db"

// Función para verificar la firma de Shopify
function verifyShopifyWebhook(req: NextRequest) {
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256")
  const shopifySecret = process.env.SHOPIFY_API_SECRET

  if (!hmacHeader || !shopifySecret) {
    return false
  }

  // Obtener el cuerpo de la solicitud como texto
  return req.text().then((body) => {
    const hash = crypto.createHmac("sha256", shopifySecret).update(body, "utf8").digest("base64")
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader))
  })
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que la solicitud viene de Shopify
    const isValid = await verifyShopifyWebhook(request)

    if (!isValid) {
      return NextResponse.json({ error: "Firma de webhook inválida" }, { status: 401 })
    }

    // Obtener el tipo de evento de Shopify
    const topic = request.headers.get("x-shopify-topic")
    const body = await request.json()

    // Procesar diferentes tipos de eventos
    switch (topic) {
      case "orders/create":
        // Procesar nueva orden
        console.log("Nueva orden recibida:", body.id)
        // Aquí podrías registrar la orden en tu base de datos
        break

      case "products/create":
      case "products/update":
        // Actualizar información de producto en nuestra base de datos
        console.log("Producto creado/actualizado:", body.id)
        break

      case "customers/create":
        // Registrar nuevo cliente
        console.log("Nuevo cliente registrado:", body.id)

        // Verificar si el cliente ya existe
        const existingUser = await queryApp("SELECT * FROM usuarios WHERE shopify_customer_id = $1", [
          body.id.toString(),
        ])

        if (existingUser.rows.length === 0) {
          // Crear nuevo usuario
          await queryApp("INSERT INTO usuarios (shopify_customer_id, email, nombre) VALUES ($1, $2, $3)", [
            body.id.toString(),
            body.email,
            `${body.first_name} ${body.last_name}`,
          ])
        }
        break

      default:
        console.log("Evento no manejado:", topic)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error procesando webhook:", error)
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 })
  }
}
