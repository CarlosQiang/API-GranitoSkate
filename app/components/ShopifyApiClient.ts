// Cliente para hacer llamadas a la API de Shopify
"use client"

// Función para obtener el token de sesión de App Bridge
function getShopifyToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("shopifySessionToken")
  }
  return null
}

// Función para hacer llamadas a la API de Shopify Admin
export async function shopifyAdminFetch(endpoint: string, options: RequestInit = {}) {
  const token = getShopifyToken()

  if (!token) {
    throw new Error("No se encontró token de Shopify")
  }

  const shop = new URLSearchParams(window.location.search).get("shop")

  if (!shop) {
    throw new Error("No se encontró tienda de Shopify")
  }

  const url = `https://${shop}/admin/api/2023-04/${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`Error en la API de Shopify: ${response.statusText}`)
  }

  return response.json()
}

// Ejemplo de función para obtener productos
export async function getShopifyProducts() {
  return shopifyAdminFetch("products.json")
}

// Ejemplo de función para obtener órdenes
export async function getShopifyOrders() {
  return shopifyAdminFetch("orders.json")
}

// Ejemplo de función para obtener clientes
export async function getShopifyCustomers() {
  return shopifyAdminFetch("customers.json")
}
