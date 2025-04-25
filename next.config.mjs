/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.shopify.com', 'storage.googleapis.com'],
  },
  // Ignorar advertencias de ESLint durante la compilación
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignorar errores de TypeScript durante la compilación
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración experimental para mejorar la compatibilidad
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
};

export default nextConfig;
