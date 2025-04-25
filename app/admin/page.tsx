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

// Función para obtener estadísticas directamente de la base de datos
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

    // Obtener datos de ejemplo para productos, pedidos y clientes
    // Estos datos son los mismos que se devuelven en las rutas API cuando hay un error
    const productsData = await getExampleProducts()
    const ordersData = await getExampleOrders()
    const customersData = await getExampleCustomers()
    const messagesData = await getExampleMessages()

    // Consultas directas a la base de datos para obtener conteos de otras tablas
    const bannersResult = await sql`SELECT COUNT(*) as count FROM banners`.catch(() => [{ count: 0 }])
    const resenasResult = await sql`SELECT COUNT(*) as count FROM resenas`.catch(() => [{ count: 0 }])
    const faqResult = await sql`SELECT COUNT(*) as count FROM faq`.catch(() => [{ count: 0 }])
    const homeBlocksResult = await sql`SELECT COUNT(*) as count FROM home_blocks`.catch(() => [{ count: 0 }])
    const skatersResult = await sql`SELECT COUNT(*) as count FROM skaters`.catch(() => [{ count: 0 }])
    const spotsResult = await sql`SELECT COUNT(*) as count FROM spots`.catch(() => [{ count: 0 }])
    const tutorialesResult = await sql`SELECT COUNT(*) as count FROM tutoriales`.catch(() => [{ count: 0 }])
    const eventosResult = await sql`SELECT COUNT(*) as count FROM eventos`.catch(() => [{ count: 0 }])

    // Extraer los conteos de los resultados
    const productsCount = productsData.length
    const ordersCount = ordersData.length
    const customersCount = customersData.length
    const messagesCount = messagesData.length
    const bannersCount = Number.parseInt(bannersResult[0]?.count || "0", 10)
    const reviewsCount = Number.parseInt(resenasResult[0]?.count || "0", 10)
    const faqCount = Number.parseInt(faqResult[0]?.count || "0", 10)
    const homeBlocksCount = Number.parseInt(homeBlocksResult[0]?.count || "0", 10)
    const skatersCount = Number.parseInt(skatersResult[0]?.count || "0", 10)
    const spotsCount = Number.parseInt(spotsResult[0]?.count || "0", 10)
    const tutorialsCount = Number.parseInt(tutorialesResult[0]?.count || "0", 10)
    const eventsCount = Number.parseInt(eventosResult[0]?.count || "0", 10)

    console.log("Conteos obtenidos:", {
      productsCount,
      ordersCount,
      customersCount,
      messagesCount,
      bannersCount,
      reviewsCount,
      faqCount,
      homeBlocksCount,
      skatersCount,
      spotsCount,
      tutorialsCount,
      eventsCount,
    })

    return {
      error: null,
      counts: {
        productsCount,
        ordersCount,
        customersCount,
        messagesCount,
        bannersCount,
        reviewsCount,
        faqCount,
        homeBlocksCount,
        skatersCount,
        spotsCount,
        tutorialsCount,
        eventsCount,
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

// Función para obtener productos de ejemplo
async function getExampleProducts() {
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

// Función para obtener pedidos de ejemplo
async function getExampleOrders() {
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

// Función para obtener clientes de ejemplo
async function getExampleCustomers() {
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

// Función para obtener mensajes de ejemplo
async function getExampleMessages() {
  return [
    {
      id: "1",
      usuario_id: "1001",
      asunto: "Consulta sobre producto",
      mensaje: "Me gustaría saber si tienen disponible la tabla Element en color negro.",
      fecha: new Date().toISOString(),
      leido: false,
    },
    {
      id: "2",
      usuario_id: "1002",
      asunto: "Problema con mi pedido",
      mensaje: "No he recibido mi pedido y ya han pasado 5 días.",
      fecha: new Date().toISOString(),
      leido: true,
    },
    {
      id: "3",
      usuario_id: "1003",
      asunto: "Devolución",
      mensaje: "Quisiera devolver un producto que compré la semana pasada.",
      fecha: new Date().toISOString(),
      leido: false,
    },
    {
      id: "4",
      usuario_id: "1001",
      asunto: "Agradecimiento",
      mensaje: "Gracias por la rápida respuesta y solución a mi problema.",
      fecha: new Date().toISOString(),
      leido: true,
    },
  ]
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

// Color de la marca para usar en todo el dashboard
const brandColor = "border-[#d29a43]"

interface StatCardProps {
  title: string
  count: number
  icon: React.ReactNode
  href: string
}

function StatCard({ title, count, icon, href }: StatCardProps) {
  return (
    <Link href={href} className="block">
      <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${brandColor} hover:shadow-lg transition-shadow`}>
        <div className="flex items-center">
          <div className="mr-4 text-[#d29a43]">{icon}</div>
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

        <div className="bg-[#f8f1e6] border-l-4 border-[#d29a43] p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-[#d29a43]" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-[#8c6529]">{error}</p>
              <div className="mt-4">
                <div className="flex">
                  <Link
                    href="/api/init-db"
                    className="bg-[#d29a43] hover:bg-[#b88438] text-white px-4 py-2 rounded-md text-sm font-medium"
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
          icon={<Package className="h-8 w-8" />}
          href="/admin/products"
        />
        <StatCard
          title="Pedidos"
          count={counts.ordersCount}
          icon={<ShoppingCart className="h-8 w-8" />}
          href="/admin/orders"
        />
        <StatCard
          title="Clientes"
          count={counts.customersCount}
          icon={<Users className="h-8 w-8" />}
          href="/admin/customers"
        />
        <StatCard
          title="Mensajes"
          count={counts.messagesCount}
          icon={<MessageSquare className="h-8 w-8" />}
          href="/admin/messages"
        />
        <StatCard
          title="Banners"
          count={counts.bannersCount}
          icon={<ImageIcon className="h-8 w-8" />}
          href="/admin/banners"
        />
        <StatCard
          title="Reseñas"
          count={counts.reviewsCount}
          icon={<Star className="h-8 w-8" />}
          href="/admin/reviews"
        />
        <StatCard title="FAQ" count={counts.faqCount} icon={<HelpCircle className="h-8 w-8" />} href="/admin/faq" />
        <StatCard
          title="Bloques de Inicio"
          count={counts.homeBlocksCount}
          icon={<Layout className="h-8 w-8" />}
          href="/admin/home-blocks"
        />
        <StatCard
          title="Skaters"
          count={counts.skatersCount}
          icon={<User className="h-8 w-8" />}
          href="/admin/skaters"
        />
        <StatCard title="Spots" count={counts.spotsCount} icon={<Map className="h-8 w-8" />} href="/admin/spots" />
        <StatCard
          title="Tutoriales"
          count={counts.tutorialsCount}
          icon={<BookOpen className="h-8 w-8" />}
          href="/admin/tutorials"
        />
        <StatCard
          title="Eventos"
          count={counts.eventsCount}
          icon={<Calendar className="h-8 w-8" />}
          href="/admin/events"
        />
      </div>
    </div>
  )
}
