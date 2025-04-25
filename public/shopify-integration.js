// Script para incluir en el tema de Shopify
// Guardar como asset en tu tema y cargar en theme.liquid

// Declarar API_URL
const API_URL = "https://api-granito-skate.vercel.app" // URL de tu API desplegada

// Función para enviar datos a nuestra API
async function sendToCustomAPI(endpoint, data) {
  try {
    // Nota: El API_KEY debe ser configurado en el tema de Shopify
    // No lo incluimos aquí para evitar exponer secretos
    const API_KEY = window.GRANITO_API_KEY || "" // Debe ser configurado en theme.liquid

    if (!API_KEY) {
      console.error("Error: API_KEY no está configurada")
      return { error: true, message: "API_KEY no configurada" }
    }

    const response = await fetch(`${API_URL}/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(data),
    })

    return await response.json()
  } catch (error) {
    console.error(`Error al enviar datos a ${endpoint}:`, error)
    return { error: true }
  }
}

// Registrar visitas a productos
function trackProductView() {
  const productId =
    document.querySelector('meta[property="product:id"]')?.content ||
    document.querySelector("[data-product-id]")?.getAttribute("data-product-id")

  if (productId) {
    // Generar o obtener ID de sesión
    let sessionId = localStorage.getItem("skate_session_id")
    if (!sessionId) {
      sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9)
      localStorage.setItem("skate_session_id", sessionId)
    }

    // Enviar datos de visita
    sendToCustomAPI("stats", {
      id_producto: productId,
      id_sesion: sessionId,
    })
  }
}

// Añadir a lista de deseos
function setupWishlistButtons() {
  document.querySelectorAll(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault()

      const productId = this.dataset.productId
      const productName = this.dataset.productName
      const userId = this.dataset.userId || "guest_" + localStorage.getItem("skate_session_id")

      if (productId) {
        sendToCustomAPI("wishlist", {
          id_producto: productId,
          nombre_producto: productName,
        }).then((response) => {
          if (!response.error) {
            // Actualizar UI
            this.classList.add("in-wishlist")
            this.querySelector(".wishlist-text").textContent = "Guardado"
          }
        })
      }
    })
  })
}

// Configurar formulario de contacto
function setupContactForm() {
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault()

      const formData = new FormData(this)
      const formJson = {
        asunto: formData.get("subject"),
        mensaje: formData.get("message"),
      }

      sendToCustomAPI("messages", formJson).then((response) => {
        if (!response.error) {
          // Mostrar mensaje de éxito
          const successMessage = document.createElement("div")
          successMessage.className = "success-message"
          successMessage.textContent = "¡Mensaje enviado correctamente!"

          this.reset()
          this.appendChild(successMessage)

          // Eliminar mensaje después de unos segundos
          setTimeout(() => {
            successMessage.remove()
          }, 5000)
        }
      })
    })
  }
}

// Cargar reseñas de productos
function loadProductReviews() {
  const reviewsContainer = document.getElementById("product-reviews")

  if (reviewsContainer) {
    const productId = reviewsContainer.dataset.productId

    if (productId) {
      fetch(`${API_URL}/api/reviews?id_producto=${productId}`)
        .then((response) => response.json())
        .then((reviews) => {
          // Filtrar solo reseñas aprobadas
          const approvedReviews = reviews.filter((review) => review.aprobada)

          if (approvedReviews.length > 0) {
            const reviewsHTML = approvedReviews
              .map(
                (review) => `
              <div class="review-item">
                <div class="review-header">
                  <span class="review-author">${review.nombre_cliente}</span>
                  <span class="review-rating">${"★".repeat(review.valoracion)}${"☆".repeat(5 - review.valoracion)}</span>
                  <span class="review-date">${new Date(review.fecha_creacion).toLocaleDateString()}</span>
                </div>
                <div class="review-content">${review.comentario}</div>
              </div>
            `,
              )
              .join("")

            reviewsContainer.innerHTML = `
              <h2>Reseñas de clientes</h2>
              <div class="reviews-list">${reviewsHTML}</div>
            `
          } else {
            reviewsContainer.innerHTML = `
              <h2>Reseñas de clientes</h2>
              <p class="no-reviews">No hay reseñas para este producto todavía.</p>
            `
          }
        })
        .catch((error) => {
          console.error("Error al cargar reseñas:", error)
          reviewsContainer.innerHTML = `
            <h2>Reseñas de clientes</h2>
            <p class="error-message">Error al cargar las reseñas.</p>
          `
        })
    }
  }
}

// Cargar banners
function loadBanners() {
  const bannersContainer = document.getElementById("granito-banners")

  if (bannersContainer) {
    fetch(`${API_URL}/api/banners`)
      .then((response) => response.json())
      .then((banners) => {
        if (banners.length > 0) {
          // Ordenar banners por orden
          banners.sort((a, b) => a.orden - b.orden)

          let bannersHTML = `<div class="banners-slider">`

          banners.forEach((banner, index) => {
            bannersHTML += `
              <div class="banner-slide ${index === 0 ? "active" : ""}" style="background-image: url('${banner.imagen_url}')">
                <div class="banner-content">
                  <h2>${banner.titulo}</h2>
                  ${banner.subtitulo ? `<p>${banner.subtitulo}</p>` : ""}
                  ${banner.enlace ? `<a href="${banner.enlace}" class="banner-button">Ver más</a>` : ""}
                </div>
              </div>
            `
          })

          // Añadir indicadores si hay más de un banner
          if (banners.length > 1) {
            bannersHTML += `<div class="banner-indicators">`
            for (let i = 0; i < banners.length; i++) {
              bannersHTML += `<button class="indicator ${i === 0 ? "active" : ""}" data-index="${i}"></button>`
            }
            bannersHTML += `</div>`
          }

          bannersHTML += `</div>`

          bannersContainer.innerHTML = bannersHTML

          // Configurar slider si hay más de un banner
          if (banners.length > 1) {
            let currentSlide = 0
            const slides = bannersContainer.querySelectorAll(".banner-slide")
            const indicators = bannersContainer.querySelectorAll(".indicator")

            // Función para cambiar de slide
            function goToSlide(index) {
              slides.forEach((slide) => slide.classList.remove("active"))
              indicators.forEach((indicator) => indicator.classList.remove("active"))

              slides[index].classList.add("active")
              indicators[index].classList.add("active")
              currentSlide = index
            }

            // Configurar indicadores
            indicators.forEach((indicator, index) => {
              indicator.addEventListener("click", () => goToSlide(index))
            })

            // Cambiar automáticamente cada 5 segundos
            setInterval(() => {
              const nextSlide = (currentSlide + 1) % slides.length
              goToSlide(nextSlide)
            }, 5000)
          }
        }
      })
      .catch((error) => {
        console.error("Error al cargar banners:", error)
      })
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Detectar si estamos en una página de producto
  if (window.location.pathname.includes("/products/")) {
    trackProductView()
    loadProductReviews()
  }

  setupWishlistButtons()
  setupContactForm()
  loadBanners()
})

// Añadir estilos CSS
const styles = `
  /* Estilos para reseñas */
  .review-item {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  .review-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .review-author {
    font-weight: bold;
  }
  .review-rating {
    color: #c39c47;
  }
  .review-date {
    color: #777;
    font-size: 0.9em;
  }
  .review-content {
    line-height: 1.5;
  }
  .no-reviews, .error-message {
    text-align: center;
    padding: 20px;
    color: #777;
  }
  .error-message {
    color: #e53e3e;
  }
  
  /* Estilos para banners */
  .banners-slider {
    position: relative;
    height: 400px;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 30px;
  }
  .banner-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 1s ease;
    display: flex;
    align-items: center;
  }
  .banner-slide.active {
    opacity: 1;
    z-index: 1;
  }
  .banner-content {
    padding: 30px;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    max-width: 50%;
    border-radius: 8px;
    margin-left: 50px;
  }
  .banner-content h2 {
    font-size: 2em;
    margin-bottom: 10px;
  }
  .banner-button {
    display: inline-block;
    background-color: #c39c47;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    margin-top: 15px;
    text-decoration: none;
    font-weight: bold;
  }
  .banner-indicators {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 2;
  }
  .indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    margin: 0 5px;
    cursor: pointer;
    border: none;
  }
  .indicator.active {
    background-color: #c39c47;
  }
  
  /* Estilos para botones de favoritos */
  .add-to-wishlist {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #f3f4f6;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .add-to-wishlist:hover {
    background-color: #e5e7eb;
  }
  .add-to-wishlist.in-wishlist {
    background-color: #f8f1e0;
    color: #c39c47;
  }
  .add-to-wishlist svg {
    margin-right: 8px;
  }
  .success-message {
    margin-top: 15px;
    padding: 10px;
    background-color: #f0fff4;
    color: #38a169;
    border-radius: 4px;
    text-align: center;
  }
`

// Añadir estilos al documento
const styleElement = document.createElement("style")
styleElement.textContent = styles
document.head.appendChild(styleElement)
