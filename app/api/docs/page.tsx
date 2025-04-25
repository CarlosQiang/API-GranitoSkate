import Link from "next/link"

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API GranitoSkate - Documentación</h1>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#b38a3f] hover:bg-[#9e7a35] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b38a3f]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 10 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Volver al inicio
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Documentación de la API</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Endpoints disponibles para la integración con Shopify
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {/* Autenticación */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Autenticación</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/auth/[...nextauth]</code> - NextAuth.js
                </dd>
              </div>

              {/* Reseñas de productos */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Reseñas de productos</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/reviews</code> - GET, POST
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener reseñas de productos. Parámetros opcionales:{" "}
                      <code>id_producto</code>
                    </p>
                    <p>
                      <strong>POST</strong>: Crear una nueva reseña. Requiere: <code>nombre_cliente</code>,{" "}
                      <code>id_producto</code>, <code>valoracion</code>. Opcional: <code>comentario</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Reseñas */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Reseñas</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/reviews</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todas las reseñas (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nueva reseña (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar reseña. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar reseña. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Lista de favoritos */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Lista de favoritos</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/wishlist</code> - GET, POST, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener lista de favoritos del usuario autenticado.
                    </p>
                    <p>
                      <strong>POST</strong>: Añadir producto a favoritos. Requiere: <code>id_producto</code>,{" "}
                      <code>nombre_producto</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar producto de favoritos. Parámetros: <code>id_producto</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Mensajes */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Mensajes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/messages</code> - GET, POST, PATCH
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener mensajes del usuario autenticado.
                    </p>
                    <p>
                      <strong>POST</strong>: Enviar un nuevo mensaje. Requiere: <code>asunto</code>,{" "}
                      <code>mensaje</code>
                    </p>
                    <p>
                      <strong>PATCH</strong>: Responder a un mensaje (admin). Requiere: <code>id</code>,{" "}
                      <code>respuesta_admin</code>, <code>admin_nombre</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Mensajes */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Mensajes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/messages</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los mensajes (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo mensaje (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar mensaje. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar mensaje. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Estadísticas */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Estadísticas</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/stats</code> - GET, POST
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener estadísticas. Parámetros opcionales: <code>id_producto</code>,{" "}
                      <code>fecha_inicio</code>, <code>fecha_fin</code>
                    </p>
                    <p>
                      <strong>POST</strong>: Registrar visita a producto. Requiere: <code>id_producto</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Eventos */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Eventos</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/events</code> - GET, POST
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener eventos. Parámetros opcionales: <code>activos=true</code>
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo evento. Requiere: <code>titulo</code>,{" "}
                      <code>fecha_inicio</code>, <code>fecha_fin</code>. Opcional: <code>descripcion</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Eventos */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Eventos</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/events</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los eventos (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo evento (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar evento. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar evento. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Encuestas */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Encuestas</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/feedback</code> - GET, POST
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener encuestas. Parámetros opcionales: <code>id_pedido</code>
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nueva encuesta. Requiere: <code>id_pedido</code>,{" "}
                      <code>satisfaccion</code>. Opcional: <code>comentario</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Webhook de Shopify */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Webhook de Shopify</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/shopify-webhook</code> - POST
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>POST</strong>: Recibir eventos de Shopify. Requiere cabecera{" "}
                      <code>x-shopify-hmac-sha256</code> para verificación.
                    </p>
                  </div>
                </dd>
              </div>

              {/* Banners */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Banners</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/banners</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los banners.
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo banner. Requiere: <code>titulo</code>, <code>imagen_url</code>.
                      Opcional: <code>subtitulo</code>, <code>enlace</code>, <code>orden</code>
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar banner. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar banner. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Banners */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Banners</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/banners</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los banners (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo banner (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar banner. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar banner. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Preguntas Frecuentes */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Preguntas Frecuentes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/faq</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todas las FAQs.
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nueva FAQ. Requiere: <code>pregunta</code>, <code>respuesta</code>
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar FAQ. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar FAQ. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin FAQ */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: FAQ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/faq</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todas las FAQs (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nueva FAQ (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar FAQ. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar FAQ. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Bloques de Inicio */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Bloques de Inicio</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/home-blocks</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los bloques de inicio.
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo bloque. Requiere: <code>titulo</code>, <code>tipo</code>.
                      Opcional: <code>descripcion</code>, <code>contenido</code>, <code>orden</code>
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar bloque. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar bloque. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Home Blocks */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Bloques de Inicio</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/home-blocks</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los bloques de inicio (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo bloque (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar bloque. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar bloque. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Builds de Skate */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Builds de Skate</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/build-skate</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener builds del usuario autenticado.
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo build. Requiere: <code>nombre_build</code>,{" "}
                      <code>tabla_id</code>. Opcional: <code>ruedas_id</code>, <code>ejes_id</code>,{" "}
                      <code>grip_id</code>, <code>otros_componentes</code>
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar build. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar build. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Productos */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Productos</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/products</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los productos (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo producto (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar producto. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar producto. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Pedidos */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Pedidos</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/orders</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los pedidos (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo pedido (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar pedido. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar pedido. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Clientes */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Clientes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/customers</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los clientes (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo cliente (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar cliente. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar cliente. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Usuarios */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Usuarios</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/users</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los usuarios (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo usuario (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar usuario. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar usuario. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Skaters */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Skaters</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/skaters</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los skaters (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo skater (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar skater. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar skater. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Spots */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Spots</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/spots</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los spots (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo spot (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar spot. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar spot. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Tutoriales */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin: Tutoriales</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/tutorials</code> - GET, POST, PUT, DELETE
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Obtener todos los tutoriales (admin).
                    </p>
                    <p>
                      <strong>POST</strong>: Crear nuevo tutorial (admin).
                    </p>
                    <p>
                      <strong>PUT</strong>: Actualizar tutorial. Requiere: <code>id</code>
                    </p>
                    <p>
                      <strong>DELETE</strong>: Eliminar tutorial. Parámetros: <code>id</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Inicialización de Base de Datos */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Inicialización de Base de Datos</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/init-db</code> - GET, POST
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Verificar estado de inicialización de la base de datos.
                    </p>
                    <p>
                      <strong>POST</strong>: Inicializar tablas en la base de datos.
                    </p>
                  </div>
                </dd>
              </div>

              {/* Inicialización de Tutoriales */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Inicialización de Tutoriales</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/init-db/tutorials</code> - GET, POST
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Verificar estado de inicialización de la tabla de tutoriales.
                    </p>
                    <p>
                      <strong>POST</strong>: Inicializar tabla de tutoriales en la base de datos.
                    </p>
                  </div>
                </dd>
              </div>

              {/* Autenticación de Shopify */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Autenticación de Shopify</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/shopify/auth</code> - GET
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Iniciar flujo de autenticación con Shopify.
                    </p>
                  </div>
                </dd>
              </div>

              {/* Callback de Shopify */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Callback de Shopify</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/shopify/callback</code> - GET
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Recibir callback de autenticación de Shopify.
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Login */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin Login</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/login</code> - POST
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>POST</strong>: Iniciar sesión como administrador. Requiere: <code>password</code>
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Verificación */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin Verificación</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/verify</code> - GET
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>GET</strong>: Verificar sesión de administrador.
                    </p>
                  </div>
                </dd>
              </div>

              {/* Admin Logout */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admin Logout</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <code>/api/admin/logout</code> - POST
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      <strong>POST</strong>: Cerrar sesión de administrador.
                    </p>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-[#b38a3f] text-white">
            <h2 className="text-lg font-medium">Instrucciones de Integración</h2>
            <p className="mt-1 max-w-2xl text-sm opacity-90">Cómo conectar esta API con tu tienda Shopify</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <span className="font-medium">Instala la aplicación en Shopify</span>
                <p className="text-sm text-gray-600 mt-1">
                  Visita la página de{" "}
                  <Link href="/install" className="text-[#b38a3f] hover:text-[#9e7a35]">
                    instalación
                  </Link>{" "}
                  y sigue las instrucciones para conectar tu tienda.
                </p>
              </li>
              <li>
                <span className="font-medium">Configura las variables de entorno</span>
                <p className="text-sm text-gray-600 mt-1">
                  Asegúrate de que todas las variables de entorno necesarias estén configuradas en tu proyecto.
                </p>
              </li>
              <li>
                <span className="font-medium">Incluye el script en tu tema de Shopify</span>
                <p className="text-sm text-gray-600 mt-1">
                  Añade el script de integración a tu tema para habilitar todas las funcionalidades.
                </p>
              </li>
              <li>
                <span className="font-medium">Prueba la conexión</span>
                <p className="text-sm text-gray-600 mt-1">
                  Verifica que la API está funcionando correctamente con tu tienda Shopify.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
