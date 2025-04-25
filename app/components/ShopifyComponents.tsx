"use client"

import { useState, useEffect } from "react"

// Componente para mostrar reseñas de productos
export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newReview, setNewReview] = useState({
    nombre_cliente: "",
    valoracion: 5,
    comentario: "",
  })

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?id_producto=${productId}`)

      if (!response.ok) {
        throw new Error("Error al cargar reseñas")
      }

      const data = await response.json()
      // Filtrar solo reseñas aprobadas
      const approvedReviews = data.filter((review) => review.aprobada)
      setReviews(approvedReviews)
    } catch (error) {
      console.error("Error:", error)
      setError("Error al cargar las reseñas. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewReview({
      ...newReview,
      [name]: name === "valoracion" ? Number(value) : value,
    })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newReview,
          id_producto: productId,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al enviar reseña")
      }

      // Limpiar formulario
      setNewReview({
        nombre_cliente: "",
        valoracion: 5,
        comentario: "",
      })

      // Mostrar mensaje de éxito
      alert("¡Gracias por tu reseña! Será revisada antes de ser publicada.")
    } catch (error) {
      console.error("Error:", error)
      setError("Error al enviar la reseña. Por favor, intenta de nuevo.")
    }
  }

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  if (loading) {
    return <div className="py-4 text-center">Cargando reseñas...</div>
  }

  return (
    <div className="product-reviews my-8">
      <h2 className="text-2xl font-bold mb-4">Reseñas de clientes</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <div className="reviews-list mb-8">
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{review.nombre_cliente}</p>
                    <p className="text-yellow-500">{renderStars(review.valoracion)}</p>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(review.fecha_creacion).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-gray-700">{review.comentario}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay reseñas para este producto todavía.</p>
        )}
      </div>

      <div className="review-form bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Deja tu opinión</h3>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label htmlFor="nombre_cliente" className="block text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="nombre_cliente"
              name="nombre_cliente"
              value={newReview.nombre_cliente}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="valoracion" className="block text-gray-700 mb-2">
              Valoración
            </label>
            <select
              id="valoracion"
              name="valoracion"
              value={newReview.valoracion}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="5">5 estrellas - Excelente</option>
              <option value="4">4 estrellas - Muy bueno</option>
              <option value="3">3 estrellas - Bueno</option>
              <option value="2">2 estrellas - Regular</option>
              <option value="1">1 estrella - Malo</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="comentario" className="block text-gray-700 mb-2">
              Comentario
            </label>
            <textarea
              id="comentario"
              name="comentario"
              value={newReview.comentario}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Enviar reseña
          </button>
        </form>
      </div>
    </div>
  )
}

// Componente para añadir a favoritos
export function WishlistButton({ productId, productName }: { productId: string; productName: string }) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkWishlistStatus()
  }, [productId])

  const checkWishlistStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/wishlist")

      if (!response.ok) {
        // Si no está autenticado o hay otro error, asumimos que no está en favoritos
        setIsInWishlist(false)
        return
      }

      const wishlist = await response.json()
      const exists = wishlist.some((item) => item.id_producto === productId)
      setIsInWishlist(exists)
    } catch (error) {
      console.error("Error al verificar estado de favoritos:", error)
      setIsInWishlist(false)
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = async () => {
    try {
      setLoading(true)

      if (isInWishlist) {
        // Eliminar de favoritos
        const response = await fetch(`/api/wishlist?id_producto=${productId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Error al eliminar de favoritos")
        }

        setIsInWishlist(false)
      } else {
        // Añadir a favoritos
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_producto: productId,
            nombre_producto: productName,
          }),
        })

        if (!response.ok) {
          throw new Error("Error al añadir a favoritos")
        }

        setIsInWishlist(true)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al actualizar favoritos. Por favor, inicia sesión para guardar productos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`flex items-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
        isInWishlist
          ? "bg-primary-100 text-primary-700 hover:bg-primary-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 mr-2 ${isInWishlist ? "text-primary-500" : "text-gray-500"}`}
        fill={isInWishlist ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {isInWishlist ? "Guardado" : "Añadir a favoritos"}
    </button>
  )
}

// Componente para formulario de contacto
export function ContactForm() {
  const [formData, setFormData] = useState({
    asunto: "",
    mensaje: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

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
    setSuccess(false)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al enviar mensaje")
      }

      setSuccess(true)
      setFormData({
        asunto: "",
        mensaje: "",
      })
    } catch (error) {
      console.error("Error:", error)
      setError("Error al enviar el mensaje. Por favor, intenta de nuevo o inicia sesión.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-form bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Contáctanos</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          ¡Mensaje enviado correctamente! Te responderemos lo antes posible.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="asunto" className="block text-gray-700 mb-2">
            Asunto
          </label>
          <input
            type="text"
            id="asunto"
            name="asunto"
            value={formData.asunto}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mensaje" className="block text-gray-700 mb-2">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </div>
  )
}

// Componente para rastrear visitas a productos
export function ProductTracker({ productId }: { productId: string }) {
  useEffect(() => {
    // Registrar visita al producto
    const trackVisit = async () => {
      try {
        await fetch("/api/stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_producto: productId,
          }),
        })
      } catch (error) {
        console.error("Error al registrar visita:", error)
      }
    }

    trackVisit()
  }, [productId])

  // Este componente no renderiza nada visible
  return null
}

// Componente para mostrar banners
export function BannersSlider() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    // Cambiar banner automáticamente cada 5 segundos
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [banners])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/banners")

      if (!response.ok) {
        throw new Error("Error al cargar banners")
      }

      const data = await response.json()
      setBanners(data)
    } catch (error) {
      console.error("Error:", error)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="py-4 text-center">Cargando banners...</div>
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <div className="banners-slider relative overflow-hidden rounded-lg h-64 md:h-80">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentBanner ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${banner.imagen_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center px-6 md:px-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{banner.titulo}</h2>
            {banner.subtitulo && <p className="text-lg md:text-xl text-white mb-4">{banner.subtitulo}</p>}
            {banner.enlace && (
              <a
                href={banner.enlace}
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2 rounded-md w-max"
              >
                Ver más
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full ${index === currentBanner ? "bg-primary-500" : "bg-white bg-opacity-50"}`}
            aria-label={`Ver banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
