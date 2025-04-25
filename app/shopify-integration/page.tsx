export default function ShopifyIntegrationPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Integración con Shopify</h1>
          <p className="text-xl text-gray-600">Guía paso a paso para integrar GranitoSkate con tu tienda Shopify</p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pasos para la integración</h2>

            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <span className="text-xl font-bold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Instalar la aplicación</h3>
                  <p className="mt-2 text-gray-600">
                    Primero, instala la aplicación GranitoSkate en tu tienda Shopify desde la página de instalación.
                    Esto configurará los permisos necesarios para que la aplicación acceda a tu tienda.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <span className="text-xl font-bold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Añadir el script de integración</h3>
                  <p className="mt-2 text-gray-600">
                    Añade el script de integración a tu tema de Shopify. Ve a tu panel de administración de Shopify,
                    navega a Tienda online &gt; Temas &gt; Acciones &gt; Editar código.
                  </p>
                  <div className="mt-4 bg-gray-50 rounded-md p-4">
                    <p className="text-sm text-gray-700 mb-2">
                      1. Crea un nuevo archivo en la carpeta <code>assets</code> llamado{" "}
                      <code>granito-integration.js</code>
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      2. Copia y pega el contenido del script que puedes descargar desde nuestra página
                    </p>
                    <p className="text-sm text-gray-700">
                      3. Añade la siguiente línea al final de tu archivo <code>theme.liquid</code>:
                    </p>
                    <pre className="mt-2 bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-sm">
                      {`{{ 'granito-integration.js' | asset_url | script_tag }}`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <span className="text-xl font-bold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Añadir componentes a tu tema</h3>
                  <p className="mt-2 text-gray-600">
                    Añade los siguientes bloques HTML a las secciones correspondientes de tu tema:
                  </p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Reseñas de productos</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Añade este código en la plantilla de producto (product.liquid):
                      </p>
                      <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-sm">
                        {`<div id="product-reviews" data-product-id="{{ product.id }}"></div>`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Botón de favoritos</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Añade este código junto al botón de añadir al carrito:
                      </p>
                      <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-sm">
                        {`<button class="add-to-wishlist" data-product-id="{{ product.id }}" data-product-name="{{ product.title }}">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
  <span class="wishlist-text">Añadir a favoritos</span>
</button>`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Banners</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Añade este código en la página de inicio (index.liquid):
                      </p>
                      <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-sm">
                        {`<div id="granito-banners"></div>`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <span className="text-xl font-bold">4</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Configurar el panel de administración</h3>
                  <p className="mt-2 text-gray-600">
                    Accede al panel de administración para gestionar tus banners, reseñas, mensajes y más. Usa la
                    contraseña que configuraste durante la instalación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Funcionalidades disponibles</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Reseñas de productos con sistema de moderación</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Lista de favoritos para usuarios</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Banners personalizables para la página de inicio</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Estadísticas de visitas a productos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
