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

    const response = await fetch(`https://${shopUrl}/admin/api/2023-04/products.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error en la API de Shopify: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data.products)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tokenResult = await sql`SELECT access_token FROM shopify_tokens LIMIT 1`
    const accessToken = tokenResult.rows[0]?.access_token

    if (!accessToken) {
      throw new Error("No se encontró token de acceso para Shopify")
    }

    const shopUrl = process.env.SHOPIFY_SHOP_URL

    const response = await fetch(`https://${shopUrl}/admin/api/2023-04/products.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product: body }),
    })

    if (!response.ok) {
      throw new Error(`Error en la API de Shopify: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data.product, { status: 201 })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
