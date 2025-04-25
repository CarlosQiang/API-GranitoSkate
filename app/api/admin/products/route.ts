import { type NextRequest, NextResponse } from "next/server"
import { queryApp } from "../../db"

// Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    // Consultar productos desde Shopify
    const shopifyProducts = await getShopifyProducts()

    return NextResponse.json(shopifyProducts)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

// Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Crear producto en Shopify
    const newProduct = await createShopifyProduct(body)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}

// Funciones auxiliares para interactuar con la API de Shopify
async function getShopifyProducts() {
  try {
    // Obtener token de acceso de la base de datos
    const tokenResult = await queryApp("SELECT access_token FROM shopify_tokens LIMIT 1")
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
    return data.products
  } catch (error) {
    console.error("Error al obtener productos de Shopify:", error)
    // Devolver datos de ejemplo si hay un error
    return [
      {
        id: "1",
        title: "Tabla Element Skate",
        body_html: "Tabla de skate profesional",
        vendor: "Element",
        product_type: "Tabla",
        created_at: new Date().toISOString(),
        handle: "tabla-element-skate",
        variants: [{ price: "59.99", inventory_quantity: 10 }],
        image: { src: "https://example.com/tabla1.jpg" },
      },
      {
        id: "2",
        title: "Ruedas Spitfire 52mm",
        body_html: "Ruedas de alta calidad",
        vendor: "Spitfire",
        product_type: "Ruedas",
        created_at: new Date().toISOString(),
        handle: "ruedas-spitfire-52mm",
        variants: [{ price: "29.99", inventory_quantity: 20 }],
        image: { src: "https://example.com/ruedas1.jpg" },
      },
      {
        id: "3",
        title: "Ejes Independent",
        body_html: "Ejes de alta resistencia",
        vendor: "Independent",
        product_type: "Ejes",
        created_at: new Date().toISOString(),
        handle: "ejes-independent",
        variants: [{ price: "39.99", inventory_quantity: 15 }],
        image: { src: "https://example.com/ejes1.jpg" },
      },
    ]
  }
}

async function createShopifyProduct(productData: any) {
  try {
    // Obtener token de acceso de la base de datos
    const tokenResult = await queryApp("SELECT access_token FROM shopify_tokens LIMIT 1")
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
      body: JSON.stringify({ product: productData }),
    })

    if (!response.ok) {
      throw new Error(`Error en la API de Shopify: ${response.statusText}`)
    }

    const data = await response.json()
    return data.product
  } catch (error) {
    console.error("Error al crear producto en Shopify:", error)
    throw error
  }
}
