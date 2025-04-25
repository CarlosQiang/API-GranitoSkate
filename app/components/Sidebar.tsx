"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  ImageIcon,
  Star,
  FileText,
  Calendar,
  HelpCircle,
  Layout,
  Map,
  User,
  BookOpen,
  ChevronDown,
  ChevronRight,
  UserCog,
  Menu,
  X,
} from "lucide-react"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  text: string
  isActive: boolean
  hasSubmenu?: boolean
  isSubmenuOpen?: boolean
  onClick?: () => void
}

function NavItem({ href, icon, text, isActive, hasSubmenu, isSubmenuOpen, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 text-sm ${
        isActive ? "bg-primary-100 text-primary-900 font-medium" : "text-gray-700 hover:bg-gray-100"
      } rounded-md transition-colors`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
      {hasSubmenu && (
        <span className="ml-auto">
          {isSubmenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
      )}
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    content: false,
    catalog: false,
    community: false,
    settings: false,
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Función para determinar si un menú debe estar abierto basado en la ruta actual
  const isMenuActive = (paths: string[]) => {
    return paths.some((path) => pathname.includes(path))
  }

  // Inicializar menús abiertos basados en la ruta actual
  useState(() => {
    const newOpenMenus = { ...openMenus }

    if (isMenuActive(["/admin/products", "/admin/orders", "/admin/customers"])) {
      newOpenMenus.catalog = true
    }

    if (isMenuActive(["/admin/banners", "/admin/home-blocks", "/admin/faq"])) {
      newOpenMenus.content = true
    }

    if (isMenuActive(["/admin/skaters", "/admin/spots", "/admin/tutorials", "/admin/events"])) {
      newOpenMenus.community = true
    }

    if (isMenuActive(["/admin/users"])) {
      newOpenMenus.settings = true
    }

    setOpenMenus(newOpenMenus)
  }, [pathname])

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-white shadow-md border border-gray-200 text-gray-700 hover:bg-gray-100"
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto fixed left-0 top-0 pt-16 z-40 transition-transform duration-300 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard</h2>

          <nav className="space-y-1">
            <NavItem href="/admin" icon={<Home className="h-5 w-5" />} text="Inicio" isActive={pathname === "/admin"} />

            {/* Catálogo */}
            <div>
              <NavItem
                href="#"
                icon={<Package className="h-5 w-5" />}
                text="Catálogo"
                isActive={
                  pathname.includes("/admin/products") ||
                  pathname.includes("/admin/orders") ||
                  pathname.includes("/admin/customers")
                }
                hasSubmenu={true}
                isSubmenuOpen={openMenus.catalog}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu("catalog")
                }}
              />
              {openMenus.catalog && (
                <div className="ml-6 mt-1 space-y-1">
                  <NavItem
                    href="/admin/products"
                    icon={<Package className="h-4 w-4" />}
                    text="Productos"
                    isActive={pathname.includes("/admin/products")}
                  />
                  <NavItem
                    href="/admin/orders"
                    icon={<ShoppingCart className="h-4 w-4" />}
                    text="Pedidos"
                    isActive={pathname.includes("/admin/orders")}
                  />
                  <NavItem
                    href="/admin/customers"
                    icon={<Users className="h-4 w-4" />}
                    text="Clientes"
                    isActive={pathname.includes("/admin/customers")}
                  />
                </div>
              )}
            </div>

            {/* Contenido */}
            <div>
              <NavItem
                href="#"
                icon={<Layout className="h-5 w-5" />}
                text="Contenido"
                isActive={
                  pathname.includes("/admin/banners") ||
                  pathname.includes("/admin/home-blocks") ||
                  pathname.includes("/admin/faq")
                }
                hasSubmenu={true}
                isSubmenuOpen={openMenus.content}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu("content")
                }}
              />
              {openMenus.content && (
                <div className="ml-6 mt-1 space-y-1">
                  <NavItem
                    href="/admin/banners"
                    icon={<ImageIcon className="h-4 w-4" />}
                    text="Banners"
                    isActive={pathname.includes("/admin/banners")}
                  />
                  <NavItem
                    href="/admin/home-blocks"
                    icon={<Layout className="h-4 w-4" />}
                    text="Bloques de Inicio"
                    isActive={pathname.includes("/admin/home-blocks")}
                  />
                  <NavItem
                    href="/admin/faq"
                    icon={<HelpCircle className="h-4 w-4" />}
                    text="FAQ"
                    isActive={pathname.includes("/admin/faq")}
                  />
                </div>
              )}
            </div>

            {/* Comunidad */}
            <div>
              <NavItem
                href="#"
                icon={<Users className="h-5 w-5" />}
                text="Comunidad"
                isActive={
                  pathname.includes("/admin/skaters") ||
                  pathname.includes("/admin/spots") ||
                  pathname.includes("/admin/tutorials") ||
                  pathname.includes("/admin/events")
                }
                hasSubmenu={true}
                isSubmenuOpen={openMenus.community}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu("community")
                }}
              />
              {openMenus.community && (
                <div className="ml-6 mt-1 space-y-1">
                  <NavItem
                    href="/admin/skaters"
                    icon={<User className="h-4 w-4" />}
                    text="Skaters"
                    isActive={pathname.includes("/admin/skaters")}
                  />
                  <NavItem
                    href="/admin/spots"
                    icon={<Map className="h-4 w-4" />}
                    text="Spots"
                    isActive={pathname.includes("/admin/spots")}
                  />
                  <NavItem
                    href="/admin/tutorials"
                    icon={<BookOpen className="h-4 w-4" />}
                    text="Tutoriales"
                    isActive={pathname.includes("/admin/tutorials")}
                  />
                  <NavItem
                    href="/admin/events"
                    icon={<Calendar className="h-4 w-4" />}
                    text="Eventos"
                    isActive={pathname.includes("/admin/events")}
                  />
                </div>
              )}
            </div>

            <NavItem
              href="/admin/reviews"
              icon={<Star className="h-5 w-5" />}
              text="Reseñas"
              isActive={pathname.includes("/admin/reviews")}
            />

            <NavItem
              href="/admin/messages"
              icon={<MessageSquare className="h-5 w-5" />}
              text="Mensajes"
              isActive={pathname.includes("/admin/messages")}
            />

            {/* Configuración */}
            <div>
              <NavItem
                href="#"
                icon={<UserCog className="h-5 w-5" />}
                text="Configuración"
                isActive={pathname.includes("/admin/users")}
                hasSubmenu={true}
                isSubmenuOpen={openMenus.settings}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu("settings")
                }}
              />
              {openMenus.settings && (
                <div className="ml-6 mt-1 space-y-1">
                  <NavItem
                    href="/admin/users"
                    icon={<UserCog className="h-4 w-4" />}
                    text="Usuarios Admin"
                    isActive={pathname.includes("/admin/users")}
                  />
                </div>
              )}
            </div>

            <NavItem
              href="/admin/shopify-integration"
              icon={<FileText className="h-5 w-5" />}
              text="Integración Shopify"
              isActive={pathname.includes("/admin/shopify-integration")}
            />
          </nav>
        </div>
      </div>
    </>
  )
}
