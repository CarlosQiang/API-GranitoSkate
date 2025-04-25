/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desactivar la verificación de ESLint durante la compilación
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Desactivar la verificación de TypeScript durante la compilación
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Añadir esta configuración para manejar módulos nativos
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // No intentar resolver módulos nativos en el cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        pg: false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Configuración de CORS para Shopify
  async headers() {
    return [
      {
        // Aplicar estos encabezados a todas las rutas
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // En producción, deberías limitar esto a los dominios de Shopify
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization, X-Shopify-Access-Token, X-Shopify-Hmac-Sha256',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
