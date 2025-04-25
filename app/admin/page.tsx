"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Users,
  MessageSquare,
  Star,
  HelpCircle,
  Layout,
  Map,
  BookOpen,
  Calendar,
  User,
  Database,
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    customers: 0,
    messages: 0,
    reviews: 0,
    faq: 0,
    homeBlocks: 0,
    spots: 0,
    tutorials: 0,
    events: 0,
    skaters: 0,
  })

  const [dbStatus, setDbStatus] = useState<"loading" | "connected" | "error">("loading")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/verify")
        if (res.ok) {
          setIsLoggedIn(true)
          fetchStats()
        } else {
          setIsLoggedIn(false)
          window.location.href = "/admin/login"
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error)
        setIsLoggedIn(false)
        window.location.href = "/admin/login"
      }
    }

    checkAuth()
  }, [])

  const fetchStats = async () => {
    try {
      // Verificar conexión a la base de datos
      const dbCheck = await fetch("/api/db-check")
      if (dbCheck.ok) {
        setDbStatus("connected")
      } else {
        setDbStatus("error")
        return
      }

      // Obtener estadísticas
      const [
        ordersRes,
        customersRes,
        messagesRes,
        reviewsRes,
        faqRes,
        homeBlocksRes,
        spotsRes,
        tutorialsRes,
        eventsRes,
        skatersRes,
      ] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/customers"),
        fetch("/api/admin/messages"),
        fetch("/api/admin/reviews"),
        fetch("/api/admin/faq"),
        fetch("/api/admin/home-blocks"),
        fetch("/api/admin/spots"),
        fetch("/api/admin/tutorials"),
        fetch("/api/admin/events"),
        fetch("/api/admin/skaters"),
      ])

      const [orders, customers, messages, reviews, faq, homeBlocks, spots, tutorials, events, skaters] =
        await Promise.all([
          ordersRes.json(),
          customersRes.json(),
          messagesRes.json(),
          reviewsRes.json(),
          faqRes.json(),
          homeBlocksRes.json(),
          spotsRes.json(),
          tutorialsRes.json(),
          eventsRes.json(),
          skatersRes.json(),
        ])

      setStats({
        orders: orders.length || 0,
        customers: customers.length || 0,
        messages: messages.length || 0,
        reviews: reviews.length || 0,
        faq: faq.length || 0,
        homeBlocks: homeBlocks.length || 0,
        spots: spots.length || 0,
        tutorials: tutorials.length || 0,
        events: events.length || 0,
        skaters: skaters.length || 0,
      })
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error)
      setDbStatus("error")
    }
  }

  const initializeDatabase = async () => {
    try {
      setDbStatus("loading")
      const res = await fetch("/api/init-db")
      if (res.ok) {
        setDbStatus("connected")
        fetchStats()
      } else {
        setDbStatus("error")
      }
    } catch (error) {
      console.error("Error inicializando base de datos:", error)
      setDbStatus("error")
    }
  }

  if (!isLoggedIn) {
    return null // No renderizar nada si no está autenticado
  }

  const StatCard = ({
    title,
    value,
    icon,
    color,
    href,
  }: { title: string; value: number; icon: React.ReactNode; color: string; href: string }) => (
    <Link href={href} className={`block w-full`}>
      <div className={`rounded-lg p-6 shadow-md transition-all hover:shadow-lg ${color}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
          <div className="text-white opacity-80">{icon}</div>
        </div>
      </div>
    </Link>
  )

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Panel de Administración</h1>

      {dbStatus === "error" && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          <h2 className="mb-2 text-lg font-semibold">Error de conexión a la base de datos</h2>
          <p className="mb-4">No se ha podido conectar con la base de datos o las tablas no existen.</p>
          <button onClick={initializeDatabase} className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
            Inicializar Base de Datos
          </button>
        </div>
      )}

      {dbStatus === "loading" && (
        <div className="mb-6 flex items-center justify-center rounded-lg bg-blue-100 p-8 text-blue-700">
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span>Cargando...</span>
        </div>
      )}

      {dbStatus === "connected" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            title="Pedidos"
            value={stats.orders}
            icon={<ShoppingBag size={32} />}
            color="bg-green-600"
            href="/admin/orders"
          />
          <StatCard
            title="Clientes"
            value={stats.customers}
            icon={<Users size={32} />}
            color="bg-purple-600"
            href="/admin/customers"
          />
          <StatCard
            title="Mensajes"
            value={stats.messages}
            icon={<MessageSquare size={32} />}
            color="bg-yellow-600"
            href="/admin/messages"
          />
          <StatCard
            title="Reseñas"
            value={stats.reviews}
            icon={<Star size={32} />}
            color="bg-orange-600"
            href="/admin/reviews"
          />
          <StatCard
            title="FAQ"
            value={stats.faq}
            icon={<HelpCircle size={32} />}
            color="bg-blue-600"
            href="/admin/faq"
          />
          <StatCard
            title="Bloques de Inicio"
            value={stats.homeBlocks}
            icon={<Layout size={32} />}
            color="bg-indigo-600"
            href="/admin/home-blocks"
          />
          <StatCard
            title="Spots"
            value={stats.spots}
            icon={<Map size={32} />}
            color="bg-green-600"
            href="/admin/spots"
          />
          <StatCard
            title="Tutoriales"
            value={stats.tutorials}
            icon={<BookOpen size={32} />}
            color="bg-red-600"
            href="/admin/tutorials"
          />
          <StatCard
            title="Eventos"
            value={stats.events}
            icon={<Calendar size={32} />}
            color="bg-pink-600"
            href="/admin/events"
          />
          <StatCard
            title="Skaters"
            value={stats.skaters}
            icon={<User size={32} />}
            color="bg-teal-600"
            href="/admin/skaters"
          />
        </div>
      )}

      {dbStatus === "connected" && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Acciones rápidas</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Link
              href="/admin/products/new"
              className="rounded-lg bg-blue-600 p-4 text-center text-white hover:bg-blue-700"
            >
              Añadir Producto
            </Link>
            <Link
              href="/admin/events/new"
              className="rounded-lg bg-green-600 p-4 text-center text-white hover:bg-green-700"
            >
              Crear Evento
            </Link>
            <Link
              href="/admin/faq/new"
              className="rounded-lg bg-purple-600 p-4 text-center text-white hover:bg-purple-700"
            >
              Añadir FAQ
            </Link>
            <Link
              href="/admin/banners/new"
              className="rounded-lg bg-orange-600 p-4 text-center text-white hover:bg-orange-700"
            >
              Crear Banner
            </Link>
            <button
              onClick={initializeDatabase}
              className="rounded-lg bg-gray-600 p-4 text-center text-white hover:bg-gray-700"
            >
              <div className="flex items-center justify-center">
                <Database className="mr-2" size={20} />
                <span>Reinicializar Base de Datos</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
