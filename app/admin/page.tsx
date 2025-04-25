import type React from "react"
import { sql } from "@/app/api/db"
import Link from "next/link"
import {
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  ImageIcon,
  Star,
  Calendar,
  HelpCircle,
  Layout,
  Map,
  User,
  BookOpen,
  AlertTriangle,
} from "lucide-react"

// Mock functions for Shopify data (replace with actual implementation)
// async function getShopifyProducts() {
//   // Replace with your actual Shopify product fetching logic
//   return [];
// }

// async function getShopifyOrders() {
//   // Replace with your actual Shopify order fetching logic
//   return [];
// }

// async function getCustomers() {
//   // Replace with your actual Shopify customer fetching logic
//   return [];
// }

async function getStats() {
  try {
    // Verificar si las tablas existen antes de hacer las consultas
    const tablesExist = await checkTablesExist()

    if (!tablesExist) {
      return {
        error: "Las tablas necesarias no existen en la base de datos. Por favor, ejecuta el script de inicialización.",
        counts: {},
      }
    }

    // Obtener estadísticas de Shopify para productos, pedidos y clientes
    let productsCount = 0
    let ordersCount = 0
    let customersCount = 0

    try {
      // Intentar obtener datos de Shopify
      const shopifyProducts = await getShopifyProducts()
      productsCount = shopifyProducts?.length || 0

      const shopifyOrders = await getShopifyOrders()
      ordersCount = shopifyOrders?.length || 0

      const customers = await getCustomers()
      customersCount = customers?.length || 0
    } catch (error) {
      console.error("Error al obtener datos de Shopify:", error)
    }

    // Obtener estadísticas de las tablas locales
    const stats = await Promise.allSettled([
      sql`SELECT COUNT(*) FROM messages`.then((res) => Number(res[0]?.count || 0)).catch(() => 0),
      sql`SELECT COUNT(*) FROM banners`.then((res) => Number(res[0]?.count || 0)).catch(() => 0),
      sql`SELECT COUNT(*) FROM resenas`.then((res) => Number(res[0]?.count || 0)).catch(() => 0),
      sql`SELECT COUNT(*) FROM faq`.then((res) => Number(res[0]?.count || 0)).catch(() => 0),
      sql`SELECT COUNT(*) FROM home_blocks`.then((res) => Number(res[0]?.count || 0)).catch(() => 0),
      sql`SELECT COUNT(*) FROM skaters`.then((res) => Number(res[0]?.count || 0)).catch(() => 0),
      sql`SELECT COUNT(*) FROM spots`.then((res) => Number(res[0]?.count || 0)).catch(() => 0),
      sql`SELECT COUNT(*) FROM tutoriales`.then((res) => Number(res[0]?.count || 0)).catch(() => 0),
      sql`SELECT COUNT(*) FROM eventos`.then((res) => Number(res[0]?.count || 0)).catch(() => 0),
    ])

    return {
      error: null,
      counts: {
        productsCount: productsCount,
        ordersCount: ordersCount,
        customersCount: customersCount,
        messagesCount: getSettledValue(stats[0], 0),
        bannersCount: getSettledValue(stats[1], 0),
        reviewsCount: getSettledValue(stats[2], 0),
        faqCount: getSettledValue(stats[3], 0),
        homeBlocksCount: getSettledValue(stats[4], 0),
        skatersCount: getSettledValue(stats[5], 0),
        spotsCount: getSettledValue(stats[6], 0),
        tutorialsCount: getSettledValue(stats[7], 0),
        eventsCount: getSettledValue(stats[8], 0),
      },
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return {
      error: "Error al conectar con la base de datos. Verifica la configuración de conexión.",
      counts: {},
    }
  }
}

// Función auxiliar para obtener el valor de una promesa resuelta o rechazada
function getSettledValue(result: PromiseSettledResult<any>, defaultValue: any) {
  return result.status === "fulfilled" ? result.value : defaultValue
}

// Verificar si las tablas necesarias existen
async function checkTablesExist() {
  try {
    // Intentar consultar una tabla para ver si existe
    await sql`SELECT 1 FROM banners LIMIT 1`
    return true
  } catch (error) {
    // Si hay un error, probablemente la tabla no existe
    return false
  }
}

// Función para obtener productos de Shopify
async function getShopifyProducts() {
  try {
    const response = await fetch("/api/admin/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return []
  }
}

// Función para obtener pedidos de Shopify
async function getShopifyOrders() {
  try {
    const response = await fetch("/api/admin/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error al obtener pedidos: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return []
  }
}

// Función para obtener clientes
async function getCustomers() {
  try {
    const response = await fetch("/api/admin/customers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error al obtener clientes: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    return []
  }
}

interface StatCardProps {
  title: string
  count: number
  icon: React.ReactNode
  href: string
  color: string
}

function StatCard({ title, count, icon, href, color }: StatCardProps) {
  return (
    <Link href={href} className="block">
      <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color} hover:shadow-lg transition-shadow`}>
        <div className="flex items-center">
          <div className="mr-4">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <p className="text-2xl font-bold">{count}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default async function AdminDashboard() {
  const { error, counts } = await getStats()

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">{error}</p>
              <div className="mt-4">
                <div className="flex">
                  <Link
                    href="/api/init-db"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Inicializar Base de Datos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Para solucionar este problema, puedes ejecutar el script de inicialización de la base de datos desde la
          terminal:
        </p>

        <div className="bg-gray-800 text-white p-4 rounded-md mb-6 overflow-x-auto">
          <code>npm run init-db</code>
        </div>

        <p className="text-gray-600">
          Este script creará todas las tablas necesarias y añadirá datos de ejemplo para que puedas empezar a trabajar
          con la aplicación.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Productos"
          count={counts.productsCount}
          icon={<Package className="h-8 w-8 text-blue-500" />}
          href="/admin/products"
          color="border-blue-500"
        />
        <StatCard
          title="Pedidos"
          count={counts.ordersCount}
          icon={<ShoppingCart className="h-8 w-8 text-green-500" />}
          href="/admin/orders"
          color="border-green-500"
        />
        <StatCard
          title="Clientes"
          count={counts.customersCount}
          icon={<Users className="h-8 w-8 text-purple-500" />}
          href="/admin/customers"
          color="border-purple-500"
        />
        <StatCard
          title="Mensajes"
          count={counts.messagesCount}
          icon={<MessageSquare className="h-8 w-8 text-yellow-500" />}
          href="/admin/messages"
          color="border-yellow-500"
        />
        <StatCard
          title="Banners"
          count={counts.bannersCount}
          icon={<ImageIcon className="h-8 w-8 text-pink-500" />}
          href="/admin/banners"
          color="border-pink-500"
        />
        <StatCard
          title="Reseñas"
          count={counts.reviewsCount}
          icon={<Star className="h-8 w-8 text-amber-500" />}
          href="/admin/reviews"
          color="border-amber-500"
        />
        <StatCard
          title="FAQ"
          count={counts.faqCount}
          icon={<HelpCircle className="h-8 w-8 text-cyan-500" />}
          href="/admin/faq"
          color="border-cyan-500"
        />
        <StatCard
          title="Bloques de Inicio"
          count={counts.homeBlocksCount}
          icon={<Layout className="h-8 w-8 text-indigo-500" />}
          href="/admin/home-blocks"
          color="border-indigo-500"
        />
        <StatCard
          title="Skaters"
          count={counts.skatersCount}
          icon={<User className="h-8 w-8 text-red-500" />}
          href="/admin/skaters"
          color="border-red-500"
        />
        <StatCard
          title="Spots"
          count={counts.spotsCount}
          icon={<Map className="h-8 w-8 text-emerald-500" />}
          href="/admin/spots"
          color="border-emerald-500"
        />
        <StatCard
          title="Tutoriales"
          count={counts.tutorialsCount}
          icon={<BookOpen className="h-8 w-8 text-violet-500" />}
          href="/admin/tutorials"
          color="border-violet-500"
        />
        <StatCard
          title="Eventos"
          count={counts.eventsCount}
          icon={<Calendar className="h-8 w-8 text-orange-500" />}
          href="/admin/events"
          color="border-orange-500"
        />
      </div>
    </div>
  )
}
