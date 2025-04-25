<div align="center">
  <img src="public/logo.png" alt="GranitoSkate Logo" width="200"/>
  
  # 🛹 API GranitoSkate

  [![Next.js](https://img.shields.io/badge/Next.js-13.4+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Shopify](https://img.shields.io/badge/Shopify-Integration-7AB55C?style=for-the-badge&logo=shopify&logoColor=white)](https://shopify.dev/)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
  [![Neon](https://img.shields.io/badge/Neon-Database-00E699?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
  
  <p>API para conectar bases de datos con Shopify y extender la funcionalidad de tiendas de skate</p>
</div>

## 📋 Índice

- [✨ Características](#-características)
- [🚀 Tecnologías](#-tecnologías)
- [🔧 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [📊 Bases de datos](#-bases-de-datos)
- [🔌 API Endpoints](#-api-endpoints)
- [🔒 Seguridad](#-seguridad)
- [📝 Licencia](#-licencia)

## ✨ Características

- 🔄 **Integración completa con Shopify**: Sincronización de productos, pedidos y clientes
- 👤 **Gestión de usuarios**: Sistema de autenticación y perfiles de usuario
- ⭐ **Reseñas de productos**: Sistema de valoraciones y comentarios
- ❤️ **Lista de favoritos**: Permite a los usuarios guardar sus productos favoritos
- 📊 **Estadísticas**: Seguimiento de visitas y análisis de datos
- 📝 **Mensajes**: Sistema de comunicación entre usuarios y administradores
- 🎯 **Eventos**: Gestión de eventos y promociones
- 📣 **Banners**: Sistema de banners personalizables para la tienda
- ❓ **FAQ**: Sistema de preguntas frecuentes
- 🏠 **Bloques de inicio**: Personalización de la página de inicio
- 🛹 **Build Skate**: Herramienta para configurar tablas de skate personalizadas
- 🧑‍🛹 **Skaters**: Gestión de perfiles de skaters
- 📍 **Spots**: Gestión de lugares para practicar skate
- 📚 **Tutoriales**: Sistema de tutoriales para aprender trucos de skate

## 🚀 Tecnologías

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
        <br>Next.js
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
        <br>TypeScript
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=postgres" width="48" height="48" alt="PostgreSQL" />
        <br>PostgreSQL
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
        <br>Tailwind
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=vercel" width="48" height="48" alt="Vercel" />
        <br>Vercel
      </td>
    </tr>
  </table>
</div>

- **Frontend**: Next.js 13+ con App Router, React 18, Tailwind CSS
- **Backend**: API Routes de Next.js, NextAuth.js para autenticación
- **Base de datos**: PostgreSQL en Neon (serverless)
- **Integración**: Shopify API, Webhooks
- **Despliegue**: Vercel

## 🔧 Instalación

\`\`\`bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/granitoskate-api.git

# Entrar al directorio
cd granitoskate-api

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
\`\`\`

## ⚙️ Configuración

### Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

\`\`\`env
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

## 📊 Bases de datos

El proyecto utiliza dos bases de datos PostgreSQL:

- **APP**: Almacena datos de usuarios, favoritos, mensajes, etc.
- **THEME**: Almacena datos relacionados con el tema de la tienda como reseñas, banners, etc.

### Inicialización

Para inicializar las bases de datos, puedes usar los siguientes endpoints:

- `/api/init-db`: Inicializa todas las tablas principales
- `/api/init-db/tutorials`: Inicializa específicamente la tabla de tutoriales

O ejecutar manualmente el script SQL:

\`\`\`sql
-- Ejecutar en ambas bases de datos
-- scripts/init_database.sql
\`\`\`

## 🔌 API Endpoints

<details>
<summary>Ver todos los endpoints disponibles</summary>

### Autenticación
- `/api/auth/[...nextauth]` - NextAuth.js

### Reseñas de productos
- `/api/reviews` - GET, POST
- `/api/admin/reviews` - GET, POST, PUT, DELETE

### Lista de favoritos
- `/api/wishlist` - GET, POST, DELETE

### Mensajes
- `/api/messages` - GET, POST, PATCH
- `/api/admin/messages` - GET, POST, PUT, DELETE

### Estadísticas
- `/api/stats` - GET, POST

### Eventos
- `/api/events` - GET, POST
- `/api/admin/events` - GET, POST, PUT, DELETE

### Encuestas
- `/api/feedback` - GET, POST

### Webhook de Shopify
- `/api/shopify-webhook` - POST

### Banners
- `/api/banners` - GET, POST, PUT, DELETE
- `/api/admin/banners` - GET, POST, PUT, DELETE

### Preguntas Frecuentes
- `/api/faq` - GET, POST, PUT, DELETE
- `/api/admin/faq` - GET, POST, PUT, DELETE

### Bloques de Inicio
- `/api/home-blocks` - GET, POST, PUT, DELETE
- `/api/admin/home-blocks` - GET, POST, PUT, DELETE

### Builds de Skate
- `/api/build-skate` - GET, POST, PUT, DELETE

### Admin: Productos
- `/api/admin/products` - GET, POST, PUT, DELETE

### Admin: Pedidos
- `/api/admin/orders` - GET, POST, PUT, DELETE

### Admin: Clientes
- `/api/admin/customers` - GET, POST, PUT, DELETE

### Admin: Usuarios
- `/api/admin/users` - GET, POST, PUT, DELETE

### Admin: Skaters
- `/api/admin/skaters` - GET, POST, PUT, DELETE

### Admin: Spots
- `/api/admin/spots` - GET, POST, PUT, DELETE

### Admin: Tutoriales
- `/api/admin/tutorials` - GET, POST, PUT, DELETE

### Inicialización de Base de Datos
- `/api/init-db` - GET, POST
- `/api/init-db/tutorials` - GET, POST

### Autenticación de Shopify
- `/api/shopify/auth` - GET
- `/api/shopify/callback` - GET

### Admin Login
- `/api/admin/login` - POST
- `/api/admin/verify` - GET
- `/api/admin/logout` - POST

</details>

Para una documentación completa de la API, visita `/api/docs` en la aplicación desplegada.

## 🔒 Seguridad

- Nunca subas archivos `.env` o `.env.local` al repositorio
- Nunca incluyas tokens o credenciales directamente en el código
- Usa siempre variables de entorno para los secretos
- Todas las rutas de administración están protegidas por autenticación
- Los webhooks de Shopify verifican la firma HMAC para garantizar la autenticidad

## 📝 Licencia

Este proyecto es parte de un Trabajo de Fin de Grado (TFG).

---

<div align="center">
  <p>Desarrollado con ❤️ por GranitoSkate</p>
  
  <a href="https://github.com/tu-usuario/granitoskate-api">
    <img src="https://img.shields.io/github/stars/tu-usuario/granitoskate-api?style=social" alt="GitHub stars" />
  </a>
</div>
