import { type NextRequest, NextResponse } from "next/server"
import { sql } from "../../db"

export async function GET(request: NextRequest) {
  try {
    const tokenResult = await sql`SELECT access_token FROM shopify_tokens LIMIT 1`
    const accessToken = tokenResult.rows[0]?.access_token

    if (!accessToken) {
      throw new Error("No se encontró token de acceso para Shopify")
    }

    const shopUrl = process.env.SHOPIFY_SHOP_URL

    const response = await fetch(`https://${shopUrl}/admin/api/2023-04/orders.json?status=any`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error en la API de Shopify: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data.orders)
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "ID de pedido y estado son requeridos" }, { status: 400 })
    }

    const tokenResult = await sql`SELECT access_token FROM shopify_tokens LIMIT 1`
    const accessToken = tokenResult.rows[0]?.access_token

    if (!accessToken) {
      throw new Error("No se encontró token de acceso para Shopify")
    }

    const shopUrl = process.env.SHOPIFY_SHOP_URL
    let response

    if (status === "fulfilled") {
      const fulfillmentData = {
        fulfillment: {
          notify_customer: true,
        },
      }

      response = await fetch(`https://${shopUrl}/admin/api/2023-04/orders/${id}/fulfillments.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fulfillmentData),
      })
    } else {
      const orderData = {
        order: {
          id: id,
          status: status,
        },
      }

      response = await fetch(`https://${shopUrl}/admin/api/2023-04/orders/${id}.json`, {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
    }

    if (!response.ok) {
      throw new Error(`Error en la API de Shopify: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(status === "fulfilled" ? data.fulfillment : data.order)
  } catch (error) {
    console.error("Error al actualizar pedido:", error)
    return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 })
  }
}
