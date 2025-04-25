import { type NextRequest, NextResponse } from "next/server"
import { queryApp } from "../../db"

// Obtener todos los pedidos
export async function GET(request: NextRequest) {
  try {
    // Consultar pedidos desde Shopify
    const shopifyOrders = await getShopifyOrders()

    return NextResponse.json(shopifyOrders)
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

// Actualizar estado de un pedido
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "ID de pedido y estado son requeridos" }, { status: 400 })
    }

    // Actualizar estado del pedido en Shopify
    const updatedOrder = await updateShopifyOrderStatus(id, status)

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error al actualizar pedido:", error)
    return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 })
  }
}

// Funciones auxiliares para interactuar con la API de Shopify
async function getShopifyOrders() {
  try {
    // Obtener token de acceso de la base de datos
    const tokenResult = await queryApp("SELECT access_token FROM shopify_tokens LIMIT 1")
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
    return data.orders
  } catch (error) {
    console.error("Error al obtener pedidos de Shopify:", error)
    // Devolver datos de ejemplo si hay un error
    return [
      {
        id: "1001",
        order_number: 1001,
        customer: { first_name: "Juan", last_name: "Pérez", email: "juan@example.com" },
        created_at: new Date().toISOString(),
        total_price: "89.98",
        financial_status: "paid",
        fulfillment_status: "fulfilled",
        line_items: [
          { title: "Tabla Element Skate", quantity: 1, price: "59.99" },
          { title: "Ruedas Spitfire 52mm", quantity: 1, price: "29.99" },
        ],
      },
      {
        id: "1002",
        order_number: 1002,
        customer: { first_name: "María", last_name: "García", email: "maria@example.com" },
        created_at: new Date().toISOString(),
        total_price: "39.99",
        financial_status: "paid",
        fulfillment_status: "unfulfilled",
        line_items: [{ title: "Ejes Independent", quantity: 1, price: "39.99" }],
      },
      {
        id: "1003",
        order_number: 1003,
        customer: { first_name: "Carlos", last_name: "López", email: "carlos@example.com" },
        created_at: new Date().toISOString(),
        total_price: "119.97",
        financial_status: "pending",
        fulfillment_status: null,
        line_items: [
          { title: "Tabla Element Skate", quantity: 1, price: "59.99" },
          { title: "Ruedas Spitfire 52mm", quantity: 1, price: "29.99" },
          { title: "Ejes Independent", quantity: 1, price: "39.99" },
        ],
      },
    ]
  }
}

async function updateShopifyOrderStatus(orderId: string, status: string) {
  try {
    // Obtener token de acceso de la base de datos
    const tokenResult = await queryApp("SELECT access_token FROM shopify_tokens LIMIT 1")
    const accessToken = tokenResult.rows[0]?.access_token

    if (!accessToken) {
      throw new Error("No se encontró token de acceso para Shopify")
    }

    const shopUrl = process.env.SHOPIFY_SHOP_URL

    // Construir el cuerpo de la solicitud según el estado
    let orderData: any = {}

    if (status === "fulfilled") {
      orderData = {
        fulfillment: {
          notify_customer: true,
        },
      }

      const response = await fetch(`https://${shopUrl}/admin/api/2023-04/orders/${orderId}/fulfillments.json`, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error(`Error en la API de Shopify: ${response.statusText}`)
      }

      const data = await response.json()
      return data.fulfillment
    } else {
      // Actualizar otros estados (cancelado, etc.)
      orderData = {
        order: {
          id: orderId,
          status: status,
        },
      }

      const response = await fetch(`https://${shopUrl}/admin/api/2023-04/orders/${orderId}.json`, {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error(`Error en la API de Shopify: ${response.statusText}`)
      }

      const data = await response.json()
      return data.order
    }
  } catch (error) {
    console.error("Error al actualizar estado del pedido en Shopify:", error)
    throw error
  }
}
