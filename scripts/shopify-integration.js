// Script para incluir en el tema de Shopify
// Guardar como asset en tu tema y cargar en theme.liquid

// Declarar API_URL y API_KEY
const API_URL = "https://api-granito-skate.vercel.app" // URL de tu API desplegada
const API_KEY = "4eecb2f14b6b6a5672dad6887b1da183" // Tu API Secret de Shopify

// Función para enviar datos a nuestra API
async function sendToCustomAPI(endpoint, data) {
  try {
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
  const productId = document.querySelector('meta[property="product:id"]')?.content

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

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Detectar si estamos en una página de producto
  if (window.location.pathname.includes("/products/")) {
    trackProductView()
  }

  setupWishlistButtons()
  setupContactForm()
})
