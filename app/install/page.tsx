"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ShopifyInstall() {
  const [shop, setShop] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!shop) {
      setError("Por favor, introduce el dominio de tu tienda Shopify")
      setLoading(false)
      return
    }

    // Asegurarse de que el dominio tenga el formato correcto
    let shopDomain = shop.trim()
    if (!shopDomain.includes(".myshopify.com")) {
      shopDomain = `${shopDomain}.myshopify.com`
    }

    // Redirigir a la ruta de autenticación de Shopify
    router.push(`/api/shopify/auth?shop=${shopDomain}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 relative flex items-center justify-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c39c47"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1" />
                <path d="M12 4v12" />
                <path d="m8 8 4-4 4 4" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">Instalar GranitoSkate en Shopify</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="shop" className="block text-gray-700 mb-2">
              Dominio de tu tienda Shopify
            </label>
            <input
              type="text"
              id="shop"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              placeholder="tu-tienda.myshopify.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Ejemplo: tu-tienda.myshopify.com o simplemente tu-tienda</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Instalando..." : "Instalar aplicación"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            Al instalar esta aplicación, estás permitiendo que GranitoSkate acceda a tu tienda Shopify para proporcionar
            funcionalidades adicionales como reseñas, listas de deseos y estadísticas.
          </p>
        </div>
      </div>
    </div>
  )
}
