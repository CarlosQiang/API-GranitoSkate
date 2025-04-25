import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API GranitoSkate - TFG</h1>
          <p className="text-xl text-gray-600">Plataforma de integración para tu tienda de skate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tarjeta de Documentación API */}
          <Link href="/api/docs" className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary-500 h-2"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Documentación API</h2>
                <p className="text-gray-600 mb-4">
                  Explora todos los endpoints disponibles y aprende cómo integrar nuestra API con tu tienda Shopify.
                </p>
                <span className="text-primary-500 font-medium flex items-center">
                  Ver documentación
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Tarjeta de Panel de Administración */}
          <Link href="/admin/login" className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary-500 h-2"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Panel de Administración</h2>
                <p className="text-gray-600 mb-4">
                  Accede al panel de control para gestionar todos los aspectos de tu tienda GranitoSkate.
                </p>
                <span className="text-primary-500 font-medium flex items-center">
                  Iniciar sesión
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Tarjeta de Instalación en Shopify */}
          <Link href="/install" className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary-500 h-2"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Instalar en Shopify</h2>
                <p className="text-gray-600 mb-4">
                  Integra GranitoSkate con tu tienda Shopify para aprovechar todas las funcionalidades.
                </p>
                <span className="text-primary-500 font-medium flex items-center">
                  Comenzar instalación
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Acerca de GranitoSkate</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Plataforma de integración para tiendas de skate con Shopify
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-gray-600 mb-4">
              GranitoSkate es una solución completa para tiendas de skate que utilizan Shopify. Nuestra API permite
              integrar funcionalidades adicionales como reseñas de productos, listas de favoritos, estadísticas de
              visitas y mucho más.
            </p>
            <p className="text-gray-600">
              Este proyecto fue desarrollado como parte de un Trabajo de Fin de Grado (TFG) para demostrar la
              integración de bases de datos externas con la plataforma Shopify.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
