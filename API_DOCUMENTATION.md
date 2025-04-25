# API Documentation - Granito Theme

Esta documentación detalla todos los endpoints disponibles en la API de Granito Theme.

## Índice
- [Autenticación](#autenticación)
- [Endpoints de Administración](#endpoints-de-administración)
- [Endpoints de Shopify](#endpoints-de-shopify)
- [Endpoints de Tema](#endpoints-de-tema)
- [Endpoints de Usuario](#endpoints-de-usuario)
- [Endpoints de Inicialización](#endpoints-de-inicialización)

## Autenticación

La mayoría de los endpoints requieren autenticación. Hay dos tipos de autenticación:

1. **Autenticación de Administrador**: Requiere una cookie `admin_session` válida.
2. **Autenticación de Usuario**: Utiliza NextAuth para la autenticación de usuarios.

## Endpoints de Administración

### Verificación de Administrador
- **URL**: `/api/admin/verify`
- **Método**: `GET`
- **Descripción**: Verifica si el usuario actual tiene una sesión de administrador válida.
- **Respuesta**: `{ authenticated: boolean }`

### Cierre de Sesión de Administrador
- **URL**: `/api/admin/logout`
- **Método**: `POST`
- **Descripción**: Cierra la sesión del administrador eliminando la cookie.
- **Respuesta**: `{ success: true }`

### Inicio de Sesión de Administrador
- **URL**: `/api/admin/login`
- **Método**: `POST`
- **Parámetros**: `{ password: string }`
- **Descripción**: Inicia sesión como administrador.
- **Respuesta**: `{ success: boolean, message: string }`

### Productos
- **URL**: `/api/admin/products`
- **Métodos**: `GET`, `POST`
- **Descripción**: Gestiona productos en Shopify.
- **GET Respuesta**: Lista de productos
- **POST Parámetros**: Datos del producto
- **POST Respuesta**: Producto creado

### Pedidos
- **URL**: `/api/admin/orders`
- **Métodos**: `GET`, `PATCH`
- **Descripción**: Gestiona pedidos en Shopify.
- **GET Respuesta**: Lista de pedidos
- **PATCH Parámetros**: `{ id: string, status: string }`
- **PATCH Respuesta**: Pedido actualizado

### Clientes
- **URL**: `/api/admin/customers`
- **Métodos**: `GET`, `PATCH`
- **Descripción**: Gestiona clientes.
- **GET Respuesta**: Lista de clientes
- **PATCH Parámetros**: `{ id: string, ...customerData }`
- **PATCH Respuesta**: Cliente actualizado

### Mensajes
- **URL**: `/api/admin/messages`
- **Métodos**: `GET`, `PATCH`
- **Descripción**: Gestiona mensajes de contacto.
- **GET Respuesta**: Lista de mensajes
- **PATCH Parámetros**: `{ id: string, respuesta_admin: string, admin_nombre: string }`
- **PATCH Respuesta**: Mensaje actualizado

### Usuarios
- **URL**: `/api/admin/users`
- **Métodos**: `GET`, `POST`
- **Descripción**: Gestiona usuarios administradores.
- **GET Respuesta**: Lista de usuarios
- **POST Parámetros**: Datos del usuario
- **POST Respuesta**: Usuario creado

### Usuario Específico
- **URL**: `/api/admin/users/[id]`
- **Métodos**: `GET`, `PUT`, `DELETE`
- **Descripción**: Gestiona un usuario específico.
- **GET Respuesta**: Datos del usuario
- **PUT Parámetros**: Datos actualizados del usuario
- **PUT Respuesta**: Usuario actualizado
- **DELETE Respuesta**: `{ message: string }`

### Reseñas
- **URL**: `/api/admin/reviews`
- **Métodos**: `GET`, `POST`, `PATCH`, `DELETE`
- **Descripción**: Gestiona reseñas de productos.
- **GET Respuesta**: Lista de reseñas
- **POST Parámetros**: Datos de la reseña
- **POST Respuesta**: Reseña creada
- **PATCH Parámetros**: `{ id: string, aprobada: boolean }`
- **PATCH Respuesta**: Reseña actualizada
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

### Reseña Específica
- **URL**: `/api/admin/reviews/[id]`
- **Métodos**: `GET`, `PUT`, `DELETE`
- **Descripción**: Gestiona una reseña específica.
- **GET Respuesta**: Datos de la reseña
- **PUT Parámetros**: Datos actualizados de la reseña
- **PUT Respuesta**: Reseña actualizada
- **DELETE Respuesta**: `{ message: string }`

### FAQs
- **URL**: `/api/admin/faq`
- **Métodos**: `GET`, `POST`, `PUT`, `DELETE`
- **Descripción**: Gestiona preguntas frecuentes.
- **GET Respuesta**: Lista de FAQs
- **POST Parámetros**: `{ pregunta: string, respuesta: string }`
- **POST Respuesta**: FAQ creada
- **PUT Parámetros**: `{ id: string, pregunta: string, respuesta: string }`
- **PUT Respuesta**: FAQ actualizada
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

### FAQ Específica
- **URL**: `/api/admin/faq/[id]`
- **Métodos**: `GET`, `PUT`, `DELETE`
- **Descripción**: Gestiona una FAQ específica.
- **GET Respuesta**: Datos de la FAQ
- **PUT Parámetros**: Datos actualizados de la FAQ
- **PUT Respuesta**: FAQ actualizada
- **DELETE Respuesta**: `{ message: string }`

### Eventos
- **URL**: `/api/admin/events`
- **Métodos**: `GET`, `POST`, `PUT`, `DELETE`
- **Descripción**: Gestiona eventos y promociones.
- **GET Respuesta**: Lista de eventos
- **POST Parámetros**: Datos del evento
- **POST Respuesta**: Evento creado
- **PUT Parámetros**: Datos actualizados del evento
- **PUT Respuesta**: Evento actualizado
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

### Evento Específico
- **URL**: `/api/admin/events/[id]`
- **Métodos**: `GET`, `PUT`, `DELETE`
- **Descripción**: Gestiona un evento específico.
- **GET Respuesta**: Datos del evento
- **PUT Parámetros**: Datos actualizados del evento
- **PUT Respuesta**: Evento actualizado
- **DELETE Respuesta**: `{ message: string }`

### Bloques de Inicio
- **URL**: `/api/admin/home-blocks`
- **Métodos**: `GET`, `POST`, `PUT`, `DELETE`
- **Descripción**: Gestiona bloques de la página de inicio.
- **GET Respuesta**: Lista de bloques
- **POST Parámetros**: Datos del bloque
- **POST Respuesta**: Bloque creado
- **PUT Parámetros**: Datos actualizados del bloque
- **PUT Respuesta**: Bloque actualizado
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

### Bloque de Inicio Específico
- **URL**: `/api/admin/home-blocks/[id]`
- **Métodos**: `GET`, `PUT`, `DELETE`
- **Descripción**: Gestiona un bloque de inicio específico.
- **GET Respuesta**: Datos del bloque
- **PUT Parámetros**: Datos actualizados del bloque
- **PUT Respuesta**: Bloque actualizado
- **DELETE Respuesta**: `{ message: string }`

### Skaters
- **URL**: `/api/admin/skaters`
- **Métodos**: `GET`, `POST`, `PUT`, `DELETE`
- **Descripción**: Gestiona perfiles de skaters.
- **GET Respuesta**: Lista de skaters
- **POST Parámetros**: Datos del skater
- **POST Respuesta**: Skater creado
- **PUT Parámetros**: Datos actualizados del skater
- **PUT Respuesta**: Skater actualizado
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

### Skater Específico
- **URL**: `/api/admin/skaters/[id]`
- **Métodos**: `GET`, `PUT`, `DELETE`
- **Descripción**: Gestiona un skater específico.
- **GET Respuesta**: Datos del skater
- **PUT Parámetros**: Datos actualizados del skater
- **PUT Respuesta**: Skater actualizado
- **DELETE Respuesta**: `{ message: string }`

### Spots
- **URL**: `/api/admin/spots`
- **Métodos**: `GET`, `POST`, `PUT`, `DELETE`
- **Descripción**: Gestiona spots de skate.
- **GET Respuesta**: Lista de spots
- **POST Parámetros**: Datos del spot
- **POST Respuesta**: Spot creado
- **PUT Parámetros**: Datos actualizados del spot
- **PUT Respuesta**: Spot actualizado
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

### Spot Específico
- **URL**: `/api/admin/spots/[id]`
- **Métodos**: `GET`, `PUT`, `DELETE`
- **Descripción**: Gestiona un spot específico.
- **GET Respuesta**: Datos del spot
- **PUT Parámetros**: Datos actualizados del spot
- **PUT Respuesta**: Spot actualizado
- **DELETE Respuesta**: `{ message: string }`

### Banners
- **URL**: `/api/admin/banners`
- **Métodos**: `GET`, `POST`, `PUT`, `DELETE`
- **Descripción**: Gestiona banners del tema.
- **GET Respuesta**: Lista de banners
- **POST Parámetros**: `{ titulo: string, subtitulo: string, imagen_url: string, enlace: string, orden: number }`
- **POST Respuesta**: Banner creado
- **PUT Parámetros**: `{ id: string, titulo: string, subtitulo: string, imagen_url: string, enlace: string, orden: number }`
- **PUT Respuesta**: Banner actualizado
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

### Banner Específico
- **URL**: `/api/admin/banners/[id]`
- **Métodos**: `GET`, `PUT`, `DELETE`
- **Descripción**: Gestiona un banner específico.
- **GET Respuesta**: Datos del banner
- **PUT Parámetros**: Datos actualizados del banner
- **PUT Respuesta**: Banner actualizado
- **DELETE Respuesta**: `{ message: string }`

### Tutoriales
- **URL**: `/api/admin/tutorials`
- **Métodos**: `GET`, `POST`
- **Descripción**: Gestiona tutoriales.
- **GET Respuesta**: Lista de tutoriales
- **POST Parámetros**: Datos del tutorial
- **POST Respuesta**: Tutorial creado

### Tutorial Específico
- **URL**: `/api/admin/tutorials/[id]`
- **Métodos**: `GET`, `PUT`, `DELETE`
- **Descripción**: Gestiona un tutorial específico.
- **GET Respuesta**: Datos del tutorial
- **PUT Parámetros**: Datos actualizados del tutorial
- **PUT Respuesta**: Tutorial actualizado
- **DELETE Respuesta**: `{ message: string }`

## Endpoints de Shopify

### Autenticación de Shopify
- **URL**: `/api/shopify/auth`
- **Método**: `GET`
- **Descripción**: Inicia el flujo de autenticación OAuth con Shopify.
- **Parámetros**: `shop` (query param)
- **Respuesta**: Redirección a Shopify para autorización

### Callback de Shopify
- **URL**: `/api/shopify/callback`
- **Método**: `GET`
- **Descripción**: Maneja la respuesta de autorización de Shopify.
- **Parámetros**: `shop`, `code` (query params)
- **Respuesta**: Redirección al panel de administración

### Webhook de Shopify
- **URL**: `/api/shopify-webhook`
- **Método**: `POST`
- **Descripción**: Recibe y procesa webhooks de Shopify.
- **Headers**: `x-shopify-hmac-sha256`, `x-shopify-topic`
- **Respuesta**: `{ success: true }`

## Endpoints de Tema

### Reseñas
- **URL**: `/api/reviews`
- **Métodos**: `GET`, `POST`
- **Descripción**: Gestiona reseñas de productos.
- **GET Parámetros**: `id_producto` (opcional, query param)
- **GET Respuesta**: Lista de reseñas
- **POST Parámetros**: `{ nombre_cliente: string, id_producto: string, valoracion: number, comentario: string }`
- **POST Respuesta**: Reseña creada

### Banners
- **URL**: `/api/banners`
- **Métodos**: `GET`, `POST`, `PUT`, `DELETE`
- **Descripción**: Gestiona banners del tema.
- **GET Respuesta**: Lista de banners
- **POST Parámetros**: `{ titulo: string, subtitulo: string, imagen_url: string, enlace: string, orden: number }`
- **POST Respuesta**: Banner creado
- **PUT Parámetros**: `{ id: string, titulo: string, subtitulo: string, imagen_url: string, enlace: string, orden: number }`
- **PUT Respuesta**: Banner actualizado
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

### FAQs
- **URL**: `/api/faq`
- **Métodos**: `GET`, `POST`, `PUT`, `DELETE`
- **Descripción**: Gestiona preguntas frecuentes.
- **GET Respuesta**: Lista de FAQs
- **POST Parámetros**: `{ pregunta: string, respuesta: string }`
- **POST Respuesta**: FAQ creada
- **PUT Parámetros**: `{ id: string, pregunta: string, respuesta: string }`
- **PUT Respuesta**: FAQ actualizada
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

### Eventos
- **URL**: `/api/events`
- **Métodos**: `GET`, `POST`
- **Descripción**: Gestiona eventos y promociones.
- **GET Parámetros**: `activos` (opcional, query param)
- **GET Respuesta**: Lista de eventos
- **POST Parámetros**: `{ titulo: string, descripcion: string, fecha_inicio: string, fecha_fin: string }`
- **POST Respuesta**: Evento creado

### Bloques de Inicio
- **URL**: `/api/home-blocks`
- **Métodos**: `GET`, `POST`, `PUT`, `DELETE`
- **Descripción**: Gestiona bloques de la página de inicio.
- **GET Respuesta**: Lista de bloques
- **POST Parámetros**: `{ titulo: string, descripcion: string, tipo: string, contenido: any, orden: number }`
- **POST Respuesta**: Bloque creado
- **PUT Parámetros**: `{ id: string, titulo: string, descripcion: string, tipo: string, contenido: any, orden: number }`
- **PUT Respuesta**: Bloque actualizado
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

## Endpoints de Usuario

### Lista de Favoritos
- **URL**: `/api/wishlist`
- **Métodos**: `GET`, `POST`, `DELETE`
- **Descripción**: Gestiona la lista de favoritos del usuario.
- **Autenticación**: Requiere sesión de usuario
- **GET Respuesta**: Lista de favoritos
- **POST Parámetros**: `{ id_producto: string, nombre_producto: string }`
- **POST Respuesta**: Favorito añadido
- **DELETE Parámetros**: `id_producto` (query param)
- **DELETE Respuesta**: `{ message: string }`

### Mensajes
- **URL**: `/api/messages`
- **Métodos**: `GET`, `POST`, `PATCH`
- **Descripción**: Gestiona mensajes de contacto.
- **Autenticación**: Requiere sesión de usuario
- **GET Respuesta**: Lista de mensajes
- **POST Parámetros**: `{ asunto: string, mensaje: string }`
- **POST Respuesta**: Mensaje creado
- **PATCH Parámetros**: `{ id: string, respuesta_admin: string, admin_nombre: string }`
- **PATCH Respuesta**: Mensaje actualizado

### Estadísticas
- **URL**: `/api/stats`
- **Métodos**: `GET`, `POST`
- **Descripción**: Registra y consulta estadísticas de visitas.
- **POST Parámetros**: `{ id_producto: string }`
- **POST Respuesta**: Visita registrada
- **GET Parámetros**: `id_producto`, `fecha_inicio`, `fecha_fin` (opcionales, query params)
- **GET Respuesta**: Estadísticas de visitas

### Feedback
- **URL**: `/api/feedback`
- **Métodos**: `GET`, `POST`
- **Descripción**: Gestiona encuestas post-compra.
- **GET Parámetros**: `id_pedido` (opcional, query param)
- **GET Respuesta**: Lista de encuestas
- **POST Parámetros**: `{ id_pedido: string, satisfaccion: number, comentario: string }`
- **POST Respuesta**: Encuesta creada

### Build Skate
- **URL**: `/api/build-skate`
- **Métodos**: `GET`, `POST`, `PUT`, `DELETE`
- **Descripción**: Gestiona builds de skates personalizados.
- **Autenticación**: Requiere sesión de usuario
- **GET Respuesta**: Lista de builds
- **POST Parámetros**: `{ nombre_build: string, tabla_id: string, ruedas_id: string, ejes_id: string, grip_id: string, otros_componentes: object }`
- **POST Respuesta**: Build creado
- **PUT Parámetros**: `{ id: string, nombre_build: string, tabla_id: string, ruedas_id: string, ejes_id: string, grip_id: string, otros_componentes: object }`
- **PUT Respuesta**: Build actualizado
- **DELETE Parámetros**: `id` (query param)
- **DELETE Respuesta**: `{ message: string }`

## Endpoints de Inicialización

### Inicializar Base de Datos
- **URL**: `/api/init-db`
- **Método**: `GET`
- **Descripción**: Inicializa las tablas necesarias en la base de datos.
- **Respuesta**: `{ message: string }`

### Inicializar Tutoriales
- **URL**: `/api/init-db/tutorials`
- **Método**: `GET`
- **Descripción**: Inicializa la tabla de tutoriales y añade datos de ejemplo.
- **Respuesta**: `{ message: string }`

## Notas Adicionales

- Todos los endpoints de administración requieren autenticación de administrador.
- Los endpoints de usuario requieren autenticación de usuario mediante NextAuth.
- Los errores se devuelven con un código de estado HTTP apropiado y un objeto JSON con una propiedad `error`.
- Las fechas se manejan en formato ISO 8601.
- Los IDs son strings o números enteros, dependiendo del contexto.
