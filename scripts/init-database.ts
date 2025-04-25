import { sql } from "@/app/api/db"

async function createTables() {
  try {
    console.log("Iniciando creación de tablas...")

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
    await sql`
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
    console.log("✅ Tabla customers creada")

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

    console.log("✅ Todas las tablas han sido creadas correctamente")
  } catch (error) {
    console.error("❌ Error al crear tablas:", error)
  }
}

// Función para insertar datos de ejemplo
async function insertSampleData() {
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

    // Insertar bloques de inicio de ejemplo
    await sql`
      INSERT INTO home_blocks (titulo, descripcion, tipo, contenido, orden)
      VALUES 
        ('Productos destacados', 'Nuestra selección de los mejores productos', 'productos', '{"ids": ["1", "2", "3", "4"]}', 1),
        ('Categorías populares', 'Explora nuestras categorías más populares', 'categorias', '{"categorias": ["Tablas", "Ruedas", "Ejes", "Ropa"]}', 2),
        ('Testimonios de clientes', 'Lo que dicen nuestros clientes', 'testimonios', '{"testimonios": [{"nombre": "Juan", "texto": "Excelente servicio y productos de calidad."}, {"nombre": "María", "texto": "Envío rápido y buena atención al cliente."}]}', 3)
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para home_blocks insertados")

    // Insertar reseñas de ejemplo
    await sql`
      INSERT INTO resenas (nombre_cliente, id_producto, valoracion, comentario, aprobada)
      VALUES 
        ('Juan Pérez', '1', 5, 'Excelente tabla, muy resistente y con buen pop.', true),
        ('María García', '1', 4, 'Buena tabla, aunque un poco cara para mi gusto.', true),
        ('Carlos López', '2', 5, 'Las mejores ruedas que he probado, muy duraderas.', true),
        ('Ana Martínez', '3', 3, 'Ejes de calidad media, esperaba algo mejor por el precio.', false),
        ('Pedro Sánchez', '2', 4, 'Buenas ruedas para street, recomendadas.', true)
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para reseñas insertados")

    // Insertar eventos de ejemplo
    await sql`
      INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, imagen_url)
      VALUES 
        ('Campeonato local de skate', 'Participa en nuestro campeonato local y gana premios increíbles', '2023-07-15', '2023-07-16', 'Skatepark Central, Madrid', 'https://images.unsplash.com/photo-1564982752979-3f7bc5cb55c3?w=800&h=500&fit=crop'),
        ('Demo de nuevos productos', 'Ven a probar las últimas novedades en tablas y accesorios', '2023-08-10', '2023-08-10', 'Tienda GranitoSkate, Barcelona', 'https://images.unsplash.com/photo-1572776685600-afa1bc45d7b8?w=800&h=500&fit=crop'),
        ('Taller de iniciación al skate', 'Aprende los fundamentos del skateboarding con nuestros instructores', '2023-09-05', '2023-09-06', 'Skatepark Sur, Valencia', 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&h=500&fit=crop')
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para eventos insertados")

    // Insertar skaters de ejemplo
    await sql`
      INSERT INTO skaters (nombre, biografia, imagen_url, redes_sociales)
      VALUES 
        ('Alex Rodríguez', 'Skater profesional con más de 10 años de experiencia. Especializado en street y park.', 'https://images.unsplash.com/photo-1583467875263-d50dec37a88c?w=400&h=400&fit=crop', '{"instagram": "@alexskate", "youtube": "AlexSkate"}'),
        ('Laura Gómez', 'Campeona nacional de skateboarding femenino. Embajadora de varias marcas de skate.', 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=400&fit=crop', '{"instagram": "@lauragomezskate", "tiktok": "@lauraskate"}'),
        ('Carlos Martínez', 'Joven promesa del skateboarding español. Especializado en trucos técnicos.', 'https://images.unsplash.com/photo-1595246007497-68a336c44efa?w=400&h=400&fit=crop', '{"instagram": "@carlosmskate", "youtube": "CarlosSkate"}')
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para skaters insertados")

    // Insertar spots de ejemplo
    await sql`
      INSERT INTO spots (nombre, descripcion, ubicacion, coordenadas, imagenes, dificultad)
      VALUES 
        ('Plaza del Skate', 'Spot urbano con escaleras, barandillas y gaps. Ideal para street.', 'Madrid, España', '{"lat": 40.416775, "lng": -3.703790}', '["https://images.unsplash.com/photo-1572776685600-afa1bc45d7b8?w=800&h=500&fit=crop", "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&h=500&fit=crop"]', 4),
        ('Skatepark Central', 'Skatepark completo con bowl, rampas y sección de street.', 'Barcelona, España', '{"lat": 41.385064, "lng": 2.173404}', '["https://images.unsplash.com/photo-1564982752979-3f7bc5cb55c3?w=800&h=500&fit=crop"]', 3),
        ('La Rampa', 'Spot con varias rampas y un pequeño bowl. Perfecto para principiantes.', 'Valencia, España', '{"lat": 39.469907, "lng": -0.376288}', '["https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&h=500&fit=crop"]', 2)
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para spots insertados")

    // Insertar tutoriales de ejemplo
    await sql`
      INSERT INTO tutoriales (titulo, descripcion, video_url, imagen_url, nivel, pasos)
      VALUES 
        ('Cómo hacer un Ollie', 'Aprende el truco básico y fundamental del skateboarding.', 'https://www.youtube.com/watch?v=QkeOAcj8Y5k', 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&h=500&fit=crop', 'principiante', '[{"titulo": "Posición de los pies", "descripcion": "Coloca el pie trasero en la cola y el delantero en el medio de la tabla."}, {"titulo": "Pop", "descripcion": "Golpea la cola contra el suelo con el pie trasero."}, {"titulo": "Desliza el pie", "descripcion": "Desliza el pie delantero hacia la punta de la tabla."}, {"titulo": "Aterriza", "descripcion": "Aterriza con ambos pies sobre la tabla."}]'),
        ('Cómo hacer un Kickflip', 'Aprende este truco clásico y espectacular.', 'https://www.youtube.com/watch?v=VasSLuFO4wY', 'https://images.unsplash.com/photo-1564982752979-3f7bc5cb55c3?w=800&h=500&fit=crop', 'intermedio', '[{"titulo": "Posición de los pies", "descripcion": "Coloca el pie trasero en la cola y el delantero en ángulo sobre el borde de la tabla."}, {"titulo": "Pop y flip", "descripcion": "Haz pop y desliza el pie delantero en diagonal para hacer girar la tabla."}, {"titulo": "Mantén la tabla a la vista", "descripcion": "Sigue la tabla con la mirada durante todo el giro."}, {"titulo": "Atrapa la tabla", "descripcion": "Atrapa la tabla con ambos pies después de que complete una vuelta completa."}]'),
        ('Cómo hacer un 50-50 Grind', 'Aprende a deslizarte sobre barandillas y bordillos.', 'https://www.youtube.com/watch?v=VYIXq41qe5A', 'https://images.unsplash.com/photo-1572776685600-afa1bc45d7b8?w=800&h=500&fit=crop', 'intermedio', '[{"titulo": "Aproximación", "descripcion": "Acércate a la barandilla con velocidad moderada y en paralelo."}, {"titulo": "Ollie", "descripcion": "Haz un ollie para subir a la barandilla."}, {"titulo": "Balance", "descripcion": "Mantén el peso centrado sobre la tabla mientras te deslizas."}, {"titulo": "Salida", "descripcion": "Al final de la barandilla, desplaza ligeramente el peso hacia atrás para salir con control."}]')
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para tutoriales insertados")

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

    // Insertar pedidos de ejemplo
    await sql`
      INSERT INTO orders (shopify_id, customer_id, total_price, status)
      VALUES 
        ('gid://shopify/Order/1001', 'gid://shopify/Customer/1', 79.99, 'completed'),
        ('gid://shopify/Order/1002', 'gid://shopify/Customer/2', 34.99, 'processing'),
        ('gid://shopify/Order/1003', 'gid://shopify/Customer/3', 164.97, 'completed')
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para pedidos insertados")

    // Insertar clientes de ejemplo
    await sql`
      INSERT INTO customers (shopify_id, email, first_name, last_name)
      VALUES 
        ('gid://shopify/Customer/1', 'juan@example.com', 'Juan', 'Pérez'),
        ('gid://shopify/Customer/2', 'maria@example.com', 'María', 'García'),
        ('gid://shopify/Customer/3', 'carlos@example.com', 'Carlos', 'López')
      ON CONFLICT DO NOTHING
    `
    console.log("✅ Datos de ejemplo para clientes insertados")

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
}

// Ejecutar la inicialización
async function init() {
  try {
    await createTables()
    await insertSampleData()
    console.log("✅ Inicialización de la base de datos completada")
  } catch (error) {
    console.error("❌ Error durante la inicialización de la base de datos:", error)
  } finally {
    process.exit()
  }
}

init()
