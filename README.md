# API GranitoSkate

API para conectar bases de datos con Shopify

## Descripción

GranitoSkate es una solución completa para tiendas de skate que utilizan Shopify. Nuestra API permite integrar funcionalidades adicionales como reseñas de productos, listas de favoritos, estadísticas de visitas y mucho más.

## Configuración

### Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

\`\`\`
# URLs de bases de datos Neon
NEON_DATABASE_URL_APP=postgresql://user:password@host/database?sslmode=require
NEON_DATABASE_URL_THEME=postgresql://user:password@host/database?sslmode=require

# Configuración de Shopify
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_APP_URL=https://your-app-url.com
SHOPIFY_SHOP_URL=your-shop.myshopify.com

# URLs de la aplicación
NEXT_PUBLIC_APP_URL=https://your-app-url.com
NEXT_PUBLIC_SHOPIFY_SHOP_URL=your-shop.myshopify.com

# Configuración de NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-app-url.com

# Configuración de Administración
ADMIN_PASSWORD=your_admin_password
ADMIN_SESSION_TOKEN=your_admin_session_token
\`\`\`

### Instalación

1. Clona este repositorio
2. Instala las dependencias: `npm install`
3. Configura las variables de entorno como se indica arriba
4. Ejecuta el servidor de desarrollo: `npm run dev`

## Bases de datos

El proyecto utiliza dos bases de datos PostgreSQL:

- **APP**: Almacena datos de usuarios, favoritos, mensajes, etc.
- **THEME**: Almacena datos relacionados con el tema de la tienda como reseñas, banners, etc.

Para inicializar las bases de datos, ejecuta el script `scripts/init_database.sql` en ambas bases de datos.

## Seguridad

- Nunca subas archivos `.env` o `.env.local` al repositorio
- Nunca incluyas tokens o credenciales directamente en el código
- Usa siempre variables de entorno para los secretos

## Licencia

Este proyecto es parte de un Trabajo de Fin de Grado (TFG).
\`\`\`

También vamos a crear un archivo para documentar cómo configurar la integración con Shopify:
