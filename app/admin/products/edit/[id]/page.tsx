"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    body_html: "",
    vendor: "",
    product_type: "",
    price: "",
    inventory_quantity: "",
    image_url: "",
  })

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      // En un entorno real, aquí harías una llamada a la API para obtener los detalles del producto
      // Como estamos usando datos de ejemplo, simularemos la obtención de datos

      // Simulación de datos - en producción, reemplaza esto con una llamada a tu API
      const mockProducts = {
        "1": {
          id: "1",
          title: "Tabla Element Skate",
          body_html: "Tabla de skate profesional",
          vendor: "Element",
          product_type: "Tabla",
          variants: [{ price: "59.99", inventory_quantity: 10 }],
          image: { src: "https://example.com/tabla1.jpg" },
        },
        "2": {
          id: "2",
          title: "Ruedas Spitfire 52mm",
          body_html: "Ruedas de alta calidad",
          vendor: "Spitfire",
          product_type: "Ruedas",
          variants: [{ price: "29.99", inventory_quantity: 20 }],
          image: { src: "https://example.com/ruedas1.jpg" },
        },
        "3": {
          id: "3",
          title: "Ejes Independent",
          body_html: "Ejes de alta resistencia",
          vendor: "Independent",
          product_type: "Ejes",
          variants: [{ price: "39.99", inventory_quantity: 15 }],
          image: { src: "https://example.com/ejes1.jpg" },
        },
      }

      // Obtener el producto por ID
      const product = mockProducts[productId] || null

      if (!product) {
        throw new Error("Producto no encontrado")
      }

      setFormData({
        title: product.title,
        body_html: product.body_html || "",
        vendor: product.vendor || "",
        product_type: product.product_type || "",
        price: product.variants?.[0]?.price || "",
        inventory_quantity: String(product.variants?.[0]?.inventory_quantity || ""),
        image_url: product.image?.src || "",
      })
    } catch (error) {
      console.error("Error al cargar el producto:", error)
      setError("Error al cargar los datos del producto. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Preparar datos para la API
      const productData = {
        id: productId,
        title: formData.title,
        body_html: formData.body_html,
        vendor: formData.vendor,
        product_type: formData.product_type,
        variants: [
          {
            price: formData.price,
            inventory_quantity: Number.parseInt(formData.inventory_quantity),
          },
        ],
        images: formData.image_url
          ? [
              {
                src: formData.image_url,
              },
            ]
          : [],
      }

      // En un entorno real, aquí harías una llamada a la API para actualizar el producto
      // Como estamos usando datos de ejemplo, simularemos la actualización
      console.log("Actualizando producto:", productData)

      // Simular tiempo de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirigir a la lista de productos
      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      console.error("Error:", err)
      setError(err.message || "Error al actualizar el producto")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !formData.title) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/products" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del producto *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="body_html" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="body_html"
                name="body_html"
                value={formData.body_html}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <input
                type="text"
                id="vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="product_type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de producto *
              </label>
              <select
                id="product_type"
                name="product_type"
                value={formData.product_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="Tabla">Tabla</option>
                <option value="Ruedas">Ruedas</option>
                <option value="Ejes">Ejes</option>
                <option value="Grip">Grip</option>
                <option value="Rodamientos">Rodamientos</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Ropa">Ropa</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="inventory_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad en inventario *
              </label>
              <input
                type="number"
                id="inventory_quantity"
                name="inventory_quantity"
                value={formData.inventory_quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                URL de la imagen
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href="/admin/products"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
