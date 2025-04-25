"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ShoppingBag,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  User,
  Calendar,
  HelpCircle,
  Map,
  Video,
  Star,
  Menu,
  X,
  Layout,
} from "lucide-react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/verify")
        const data = await res.json()

        if (data.authenticated) {
          setIsLoggedIn(true)
          setCurrentUser(data.user)
        } else {
          setIsLoggedIn(false)
          setCurrentUser(null)
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error)
        setIsLoggedIn(false)
        setCurrentUser(null)
      }
    }

    // Solo verificar autenticación si estamos en una ruta de admin
    if (pathname?.startsWith("/admin") && pathname !== "/admin/login") {
      checkAuth()
    } else if (pathname === "/admin/login") {
      // En la página de login no necesitamos mostrar el sidebar
      setIsLoggedIn(false)
    }
  }, [pathname])

  // No mostrar el sidebar si no está autenticado y no está en la página de login
  if (!isLoggedIn && pathname !== "/admin/login") {
    return null
  }

  // No mostrar el sidebar en la página de login
  if (pathname === "/admin/login") {
    return null
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const MenuItem = ({
    href,
    icon,
    text,
    active,
  }: { href: string; icon: React.ReactNode; text: string; active: boolean }) => (
    <Link
      href={href}
      className={`flex items-center rounded-lg px-4 py-2 text-sm ${
        active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={closeSidebar}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </Link>
  )

  return (
    <>
      {/* Botón de menú móvil */}
      <button
        className="fixed left-4 top-4 z-50 rounded-md bg-blue-600 p-2 text-white shadow-md md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para cerrar el sidebar en móvil */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold text-blue-600" onClick={closeSidebar}>
              GranitoSkate
            </Link>
            <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 md:hidden" onClick={closeSidebar}>
              <X size={20} />
            </button>
          </div>

          {currentUser && (
            <div className="mb-6 flex items-center p-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{currentUser.nombre || currentUser.username}</p>
                <p className="text-xs text-gray-500">{currentUser.rol}</p>
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-1 overflow-y-auto">
            <MenuItem href="/admin" icon={<Home size={20} />} text="Dashboard" active={pathname === "/admin"} />

            <MenuItem
              href="/admin/products"
              icon={<ShoppingBag size={20} />}
              text="Productos"
              active={pathname?.startsWith("/admin/products")}
            />

            <MenuItem
              href="/admin/orders"
              icon={<ShoppingBag size={20} />}
              text="Pedidos"
              active={pathname?.startsWith("/admin/orders")}
            />

            <MenuItem
              href="/admin/customers"
              icon={<Users size={20} />}
              text="Clientes"
              active={pathname?.startsWith("/admin/customers")}
            />

            <MenuItem
              href="/admin/messages"
              icon={<MessageSquare size={20} />}
              text="Mensajes"
              active={pathname?.startsWith("/admin/messages")}
            />

            <MenuItem
              href="/admin/reviews"
              icon={<Star size={20} />}
              text="Reseñas"
              active={pathname?.startsWith("/admin/reviews")}
            />

            <MenuItem
              href="/admin/faq"
              icon={<HelpCircle size={20} />}
              text="FAQ"
              active={pathname?.startsWith("/admin/faq")}
            />

            <MenuItem
              href="/admin/home-blocks"
              icon={<Layout size={20} />}
              text="Bloques de Inicio"
              active={pathname?.startsWith("/admin/home-blocks")}
            />

            <MenuItem
              href="/admin/spots"
              icon={<Map size={20} />}
              text="Spots"
              active={pathname?.startsWith("/admin/spots")}
            />

            <MenuItem
              href="/admin/tutorials"
              icon={<Video size={20} />}
              text="Tutoriales"
              active={pathname?.startsWith("/admin/tutorials")}
            />

            <MenuItem
              href="/admin/events"
              icon={<Calendar size={20} />}
              text="Eventos"
              active={pathname?.startsWith("/admin/events")}
            />

            <MenuItem
              href="/admin/skaters"
              icon={<User size={20} />}
              text="Skaters"
              active={pathname?.startsWith("/admin/skaters")}
            />

            {/* Solo mostrar gestión de usuarios para administradores */}
            {currentUser?.rol === "admin" && (
              <MenuItem
                href="/admin/usuarios"
                icon={<Users size={20} />}
                text="Gestión de Usuarios"
                active={pathname?.startsWith("/admin/usuarios")}
              />
            )}

            <MenuItem
              href="/admin/settings"
              icon={<Settings size={20} />}
              text="Configuración"
              active={pathname?.startsWith("/admin/settings")}
            />
          </nav>

          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} className="mr-3" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal con margen para el sidebar */}
      <div className="md:ml-64">{/* El contenido de la página se renderiza aquí */}</div>
    </>
  )
}
