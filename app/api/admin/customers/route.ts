import { type NextRequest, NextResponse } from "next/server"
import { queryApp } from "../../db"

// Obtener todos los clientes
export async function GET(request: NextRequest) {
  try {
    // Consultar clientes desde Shopify y nuestra base de datos
    const customers = await getCustomers()

    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 })
  }
}

// Actualizar información de un cliente
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...customerData } = body

    if (!id) {
      return NextResponse.json({ error: "ID de cliente requerido" }, { status: 400 })
    }

    // Actualizar cliente en nuestra base de datos
    const updatedCustomer = await updateCustomer(id, customerData)

    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error("Error al actualizar cliente:", error)
    return NextResponse.json({ error: "Error al actualizar cliente" }, { status: 500 })
  }
}

// Funciones auxiliares
async function getCustomers() {
  try {
    // Obtener clientes de nuestra base de datos
    const dbCustomers = await queryApp("SELECT * FROM usuarios ORDER BY fecha_creacion DESC")

    // Intentar obtener clientes de Shopify
    let shopifyCustomers = []
    try {
      shopifyCustomers = await getShopifyCustomers()
    } catch (error) {
      console.error("Error al obtener clientes de Shopify:", error)
    }

    // Combinar los datos
    const combinedCustomers = [...dbCustomers.rows]

    // Agregar clientes de Shopify que no estén en nuestra base de datos
    for (const shopifyCustomer of shopifyCustomers) {
      const exists = combinedCustomers.some((c) => c.shopify_customer_id === shopifyCustomer.id.toString())
      if (!exists) {
        combinedCustomers.push({
          id: null,
          shopify_customer_id: shopifyCustomer.id.toString(),
          email: shopifyCustomer.email,
          nombre: `${shopifyCustomer.first_name} ${shopifyCustomer.last_name}`,
          fecha_creacion: shopifyCustomer.created_at,
        })
      }
    }

    return combinedCustomers
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    // Devolver datos de ejemplo si hay un error
    return [
      {
        id: "1",
        shopify_customer_id: "1001",
        email: "juan@example.com",
        nombre: "Juan Pérez",
        fecha_creacion: new Date().toISOString(),
      },
      {
        id: "2",
        shopify_customer_id: "1002",
        email: "maria@example.com",
        nombre: "María García",
        fecha_creacion: new Date().toISOString(),
      },
      {
        id: "3",
        shopify_customer_id: "1003",
        email: "carlos@example.com",
        nombre: "Carlos López",
        fecha_creacion: new Date().toISOString(),
      },
    ]
  }
}

async function updateCustomer(id: string, customerData: any) {
  try {
    // Actualizar cliente en nuestra base de datos
    const query = `
      UPDATE usuarios
      SET nombre = $1, email = $2
      WHERE id = $3
      RETURNING *
    `

    const result = await queryApp(query, [customerData.nombre, customerData.email, id])

    if (result.rows.length === 0) {
      throw new Error("Cliente no encontrado")
    }

    return result.rows[0]
  } catch (error) {
    console.error("Error al actualizar cliente:", error)
    throw error
  }
}

async function getShopifyCustomers() {
  try {
    // Obtener token de acceso de la base de datos
    const tokenResult = await queryApp("SELECT access_token FROM shopify_tokens LIMIT 1")
    const accessToken = tokenResult.rows[0]?.access_token

    if (!accessToken) {
      throw new Error("No se encontró token de acceso para Shopify")
    }

    const shopUrl = process.env.SHOPIFY_SHOP_URL

    const response = await fetch(`https://${shopUrl}/admin/api/2023-04/customers.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error en la API de Shopify: ${response.statusText}`)
    }

    const data = await response.json()
    return data.customers
  } catch (error) {
    console.error("Error al obtener clientes de Shopify:", error)
    throw error
  }
}
