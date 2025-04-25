import { sql } from "@/app/api/db"

async function createTables() {
  try {
    console.log("Iniciando creación de tablas...")

    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla admin_users creada")

    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES ('admin', '$2b$10$X7o4c5Qh.9QyXOYUB.2H2eO/3xO7WFl9g5VXCyqXH5Xd4wQlYlVwW')
      ON CONFLICT (username) DO NOTHING
    `
    console.log("✅ Usuario admin creado")

    await sql`
      CREATE TABLE IF NOT EXISTS shopify_tokens (
        id SERIAL PRIMARY KEY,
        shop TEXT NOT NULL UNIQUE,
        access_token TEXT NOT NULL,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla shopify_tokens creada")

    // Crear tabla de banners
    await sql`
      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        subtitulo TEXT,
        imagen_url TEXT NOT NULL,
        enlace TEXT,
        orden INTEGER DEFAULT 0,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla banners creada")

    // Crear tabla de FAQ
    await sql`
      CREATE TABLE IF NOT EXISTS faq (
        id SERIAL PRIMARY KEY,
        pregunta TEXT NOT NULL,
        respuesta TEXT NOT NULL,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla faq creada")

    // Crear tabla de home_blocks
    await sql`
      CREATE TABLE IF NOT EXISTS home_blocks (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        tipo TEXT NOT NULL,
        contenido JSONB,
        orden INTEGER DEFAULT 0,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla home_blocks creada")

    // Crear tabla de resenas
    await sql`
      CREATE TABLE IF NOT EXISTS resenas (
        id SERIAL PRIMARY KEY,
        nombre_cliente TEXT NOT NULL,
        id_producto TEXT NOT NULL,
        valoracion INTEGER NOT NULL,
        comentario TEXT,
        aprobada BOOLEAN DEFAULT false,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla resenas creada")

    // Crear tabla de eventos
    await sql`
      CREATE TABLE IF NOT EXISTS eventos (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        ubicacion TEXT,
        imagen_url TEXT,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla eventos creada")

    // Crear tabla de skaters
    await sql`
      CREATE TABLE IF NOT EXISTS skaters (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        biografia TEXT,
        imagen_url TEXT,
        redes_sociales JSONB,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla skaters creada")

    // Crear tabla de spots
    await sql`
      CREATE TABLE IF NOT EXISTS spots (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        ubicacion TEXT NOT NULL,
        coordenadas JSONB,
        imagenes JSONB,
        dificultad INTEGER,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla spots creada")

    // Crear tabla de tutoriales
    await sql`
      CREATE TABLE IF NOT EXISTS tutoriales (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        video_url TEXT,
        imagen_url TEXT,
        nivel TEXT,
        pasos JSONB,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla tutoriales creada")

    // Crear tabla de productos (para estadísticas)
    /*await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        shopify_id TEXT UNIQUE,
        title TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla products creada")

    // Crear tabla de pedidos (para estadísticas)
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        shopify_id TEXT UNIQUE,
        customer_id TEXT,
        total_price DECIMAL(10, 2),
        status TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla orders creada")

    // Crear tabla de clientes (para estadísticas)
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        shopify_id TEXT UNIQUE,
        email TEXT,
        first_name TEXT,
        last_name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla customers creada")*/

    // Crear tabla de mensajes
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla messages creada")

    // Crear tabla de usuarios
    await sql`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        shopify_customer_id TEXT UNIQUE,
        email TEXT NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla usuarios creada")

    // Crear tabla de favoritos
    await sql`
      CREATE TABLE IF NOT EXISTS favoritos (
        id SERIAL PRIMARY KEY,
        usuario_id TEXT NOT NULL,
        id_producto TEXT NOT NULL,
        nombre_producto TEXT NOT NULL,
        fecha_agregado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(usuario_id, id_producto)
      )
    `
    console.log("✅ Tabla favoritos creada")

    // Crear tabla de visitas
    await sql`
      CREATE TABLE IF NOT EXISTS visitas (
        id SERIAL PRIMARY KEY,
        usuario_id TEXT,
        id_producto TEXT NOT NULL,
        fecha_visita TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla visitas creada")

    await sql`
      CREATE TABLE IF NOT EXISTS theme_config (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✅ Tabla theme_config creada")

    // Insertar token de Shopify si existe en las variables de entorno
    if (process.env.SHOPIFY_SHOP_URL && process.env.SHOPIFY_ACCESS_TOKEN) {
      await sql`
        INSERT INTO shopify_tokens (shop, access_token)
        VALUES (${process.env.SHOPIFY_SHOP_URL}, ${process.env.SHOPIFY_ACCESS_TOKEN})
        ON CONFLICT (shop) DO UPDATE SET access_token = ${process.env.SHOPIFY_ACCESS_TOKEN}
      `
      console.log("✅ Token de Shopify insertado")
    }

    console.log("✅ Todas las tablas han sido creadas correctamente")
  } catch (error) {
    console.error("❌ Error al crear tablas:", error)
  }
}

// Función para insertar datos de ejemplo
/*async function insertSampleData() {
  try {
    console.log("Insertando datos de ejemplo...")

    // Insertar banners de ejemplo
    await sql`
      INSERT INTO banners (titulo, subtitulo, imagen_url, enlace, orden)
      VALUES 
        ('Nueva colección de tablas', 'Descubre las últimas novedades en tablas de skate', 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1200&h=400&fit=crop', '/collections/tablas', 1),
        ('Ofertas en ruedas', 'Hasta 30% de descuento en ruedas Spitfire', 'https://images.unsplash.com/photo-1531565637446-32307b194362?w=1200&h=400&fit=crop', '/collections/ruedas', 2),
        ('Accesorios premium', 'La mejor selección de accesorios para tu skate', 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=1200&h=400&fit=crop', '/collections/accesorios', 3)
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para banners insertados")

    // Insertar FAQ de ejemplo
    await sql`
      INSERT INTO faq (pregunta, respuesta)
      VALUES 
        ('¿Cuánto tiempo tarda el envío?', 'Los envíos nacionales suelen tardar entre 2-3 días laborables. Para envíos internacionales, el tiempo estimado es de 5-10 días.'),
        ('¿Puedo devolver un producto?', 'Sí, aceptamos devoluciones dentro de los 14 días posteriores a la recepción del producto. El producto debe estar sin usar y en su embalaje original.'),
        ('¿Ofrecen garantía?', 'Todos nuestros productos tienen una garantía de 2 años contra defectos de fabricación.'),
        ('¿Tienen tienda física?', 'Sí, nuestra tienda física está ubicada en Calle Ejemplo, 123, Madrid. Horario: Lunes a Viernes de 10:00 a 20:00.'),
        ('¿Hacen envíos internacionales?', 'Sí, realizamos envíos a toda Europa y algunos países de América Latina. Consulta los gastos de envío específicos para tu país.')
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para FAQ insertados")

    // Insertar productos de ejemplo
    await sql`
      INSERT INTO products (shopify_id, title, description, price, image_url)
      VALUES 
        ('gid://shopify/Product/1', 'Tabla Element Skate', 'Tabla de skate profesional de la marca Element.', 79.99, 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=500&h=500&fit=crop'),
        ('gid://shopify/Product/2', 'Ruedas Spitfire 52mm', 'Ruedas de alta calidad para street y park.', 34.99, 'https://images.unsplash.com/photo-1531565637446-32307b194362?w=500&h=500&fit=crop'),
        ('gid://shopify/Product/3', 'Ejes Independent', 'Ejes de alta resistencia para todo tipo de terrenos.', 49.99, 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=500&h=500&fit=crop')
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para productos insertados")

    // Insertar mensajes de ejemplo
    await sql`
      INSERT INTO messages (name, email, subject, message, status)
      VALUES 
        ('Juan Pérez', 'juan@example.com', 'Consulta sobre disponibilidad', 'Hola, me gustaría saber si tienen disponible la tabla Element en color negro.', 'pending'),
        ('María García', 'maria@example.com', 'Problema con mi pedido', 'Mi pedido #1002 llegó con un artículo dañado. ¿Cómo puedo solicitar un cambio?', 'pending'),
        ('Carlos López', 'carlos@example.com', 'Devolución', 'Necesito hacer una devolución de mi compra reciente. ¿Cuál es el procedimiento?', 'pending')
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para mensajes insertados")

    console.log("✅ Todos los datos de ejemplo han sido insertados correctamente")
  } catch (error) {
    console.error("❌ Error al insertar datos de ejemplo:", error)
  }
}*/

// Ejecutar la inicialización
async function init() {
  try {
    await createTables()
    //await insertSampleData()
    console.log("✅ Inicialización de la base de datos completada")
  } catch (error) {
    console.error("❌ Error durante la inicialización de la base de datos:", error)
  } finally {
    process.exit()
  }
}

init()
