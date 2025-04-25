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

    // Obtener clientes de nuestra base de datos
    const dbCustomers = await sql`SELECT * FROM usuarios ORDER BY fecha_creacion DESC`

    // Combinar los datos
    const combinedCustomers = [...dbCustomers.rows]

    // Agregar clientes de Shopify que no estén en nuestra base de datos
    for (const shopifyCustomer of data.customers) {
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

    return NextResponse.json(combinedCustomers)
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...customerData } = body

    if (!id) {
      return NextResponse.json({ error: "ID de cliente requerido" }, { status: 400 })
    }

    const result = await sql`
      UPDATE usuarios
      SET nombre = ${customerData.nombre}, email = ${customerData.email}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      throw new Error("Cliente no encontrado")
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error al actualizar cliente:", error)
    return NextResponse.json({ error: "Error al actualizar cliente" }, { status: 500 })
  }
}
