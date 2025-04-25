-- Script para inicializar las bases de datos de GranitoSkate
-- Este script debe ejecutarse en ambas bases de datos (APP y THEME)

-- Base de datos APP (usuarios, favoritos, etc.)

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  shopify_customer_id TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (shopify_customer_id, email, nombre) VALUES
('1001', 'juan@example.com', 'Juan Pérez'),
('1002', 'maria@example.com', 'María García'),
('1003', 'carlos@example.com', 'Carlos López'),
('1004', 'ana@example.com', 'Ana Martínez'),
('1005', 'pedro@example.com', 'Pedro Sánchez')
ON CONFLICT (email) DO NOTHING;

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS administradores (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'editor', -- 'admin', 'editor', 'viewer'
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar un administrador por defecto
INSERT INTO administradores (email, nombre, rol)
VALUES ('admin@granitoskate.com', 'Administrador Principal', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Tabla de tokens de Shopify
CREATE TABLE IF NOT EXISTS shopify_tokens (
  id SERIAL PRIMARY KEY,
  shop TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar token de ejemplo (usando placeholder en lugar del token real)
INSERT INTO shopify_tokens (shop, access_token)
VALUES ('qiangtheme.myshopify.com', 'SHOPIFY_ACCESS_TOKEN_PLACEHOLDER')
ON CONFLICT (shop) DO NOTHING;

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id SERIAL PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  id_producto TEXT NOT NULL,
  nombre_producto TEXT NOT NULL,
  fecha_agregado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, id_producto)
);

-- Insertar favoritos de ejemplo
INSERT INTO favoritos (usuario_id, id_producto, nombre_producto) VALUES
('1', '1', 'Tabla Element Skate'),
('1', '2', 'Ruedas Spitfire 52mm'),
('2', '3', 'Ejes Independent'),
('3', '1', 'Tabla Element Skate')
ON CONFLICT (usuario_id, id_producto) DO NOTHING;

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes (
  id SERIAL PRIMARY KEY,
  usuario_id TEXT,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  respuesta_admin TEXT,
  estado TEXT DEFAULT 'pendiente',
  fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar mensajes de ejemplo
INSERT INTO mensajes (usuario_id, asunto, mensaje, estado) VALUES
('1', 'Consulta sobre disponibilidad', 'Hola, me gustaría saber si tienen disponible la tabla Element en color negro.', 'pendiente'),
('2', 'Problema con mi pedido', 'Mi pedido #1002 llegó con un artículo dañado. ¿Cómo puedo solicitar un cambio?', 'pendiente'),
('3', 'Devolución', 'Necesito hacer una devolución de mi compra reciente. ¿Cuál es el procedimiento?', 'pendiente'),
('1', 'Información sobre envíos', '¿Cuánto tiempo tarda un envío a Canarias?', 'pendiente'),
('4', 'Descuento para clubs', 'Represento a un club de skate local. ¿Ofrecen descuentos para compras al por mayor?', 'pendiente');

-- Tabla de visitas
CREATE TABLE IF NOT EXISTS visitas (
  id SERIAL PRIMARY KEY,
  usuario_id TEXT,
  id_producto TEXT NOT NULL,
  fecha_visita TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar visitas de ejemplo
INSERT INTO visitas (usuario_id, id_producto) VALUES
('1', '1'),
('1', '2'),
('2', '1'),
('3', '3'),
('null', '1'),
('null', '2'),
('null', '3');

-- Tabla de encuestas
CREATE TABLE IF NOT EXISTS encuestas (
  id SERIAL PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  id_pedido TEXT NOT NULL,
  satisfaccion INTEGER NOT NULL,
  comentario TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar encuestas de ejemplo
INSERT INTO encuestas (usuario_id, id_pedido, satisfaccion, comentario) VALUES
('1', '1001', 5, 'Excelente servicio, muy rápido.'),
('2', '1002', 4, 'Buen servicio, pero el empaquetado podría mejorar.'),
('3', '1003', 5, 'Todo perfecto, repetiré sin duda.');

-- Tabla de builds de skates
CREATE TABLE IF NOT EXISTS build_skates (
  id SERIAL PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  nombre_build TEXT NOT NULL,
  tabla_id TEXT NOT NULL,
  ruedas_id TEXT,
  ejes_id TEXT,
  grip_id TEXT,
  otros_componentes JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar builds de ejemplo
INSERT INTO build_skates (usuario_id, nombre_build, tabla_id, ruedas_id, ejes_id, grip_id, otros_componentes) VALUES
('1', 'Mi setup de street', '1', '2', '3', '4', '{"rodamientos": "5", "hardware": "6"}'),
('2', 'Setup para park', '7', '8', '9', '10', '{"rodamientos": "11", "hardware": "12"}');

-- Tabla de acciones de administrador
CREATE TABLE IF NOT EXISTS acciones_admin (
  id SERIAL PRIMARY KEY,
  admin_nombre TEXT NOT NULL,
  tipo_accion TEXT NOT NULL,
  detalles JSONB,
  fecha_accion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Base de datos THEME (reseñas, eventos, banners, etc.)

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS resenas (
  id SERIAL PRIMARY KEY,
  nombre_cliente TEXT NOT NULL,
  id_producto TEXT NOT NULL,
  valoracion INTEGER NOT NULL,
  comentario TEXT,
  aprobada BOOLEAN DEFAULT false,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar reseñas de ejemplo
INSERT INTO resenas (nombre_cliente, id_producto, valoracion, comentario, aprobada) VALUES
('Juan Pérez', '1', 5, 'Excelente tabla, muy resistente y con buen pop.', true),
('María García', '1', 4, 'Buena tabla, aunque un poco cara para mi gusto.', true),
('Carlos López', '2', 5, 'Las mejores ruedas que he probado, muy duraderas.', true),
('Ana Martínez', '3', 3, 'Ejes de calidad media, esperaba algo mejor por el precio.', false),
('Pedro Sánchez', '2', 4, 'Buenas ruedas para street, recomendadas.', true),
('Laura Rodríguez', '1', 5, 'Tabla perfecta para principiantes y avanzados.', true),
('Miguel Fernández', '3', 4, 'Buenos ejes, aunque un poco pesados.', true),
('Sofía Gómez', '2', 5, 'Excelentes ruedas, muy buena relación calidad-precio.', true),
('Javier Torres', '1', 2, 'La tabla se astilló después de un mes de uso.', false),
('Elena Díaz', '3', 5, 'Los mejores ejes del mercado, muy duraderos.', true);

-- Tabla de banners
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  imagen_url TEXT NOT NULL,
  enlace TEXT,
  orden INTEGER DEFAULT 0,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar banners de ejemplo
INSERT INTO banners (titulo, subtitulo, imagen_url, enlace, orden) VALUES
('Nueva colección de tablas', 'Descubre las últimas novedades en tablas de skate', 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1200&h=400&fit=crop', '/collections/tablas', 1),
('Ofertas en ruedas', 'Hasta 30% de descuento en ruedas Spitfire', 'https://images.unsplash.com/photo-1531565637446-32307b194362?w=1200&h=400&fit=crop', '/collections/ruedas', 2),
('Accesorios premium', 'La mejor selección de accesorios para tu skate', 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=1200&h=400&fit=crop', '/collections/accesorios', 3);

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS eventos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar eventos de ejemplo
INSERT INTO eventos (titulo, descripcion, fecha_inicio, fecha_fin) VALUES
('Campeonato local de skate', 'Participa en nuestro campeonato local y gana premios increíbles', '2023-07-15', '2023-07-16'),
('Demo de nuevos productos', 'Ven a probar las últimas novedades en tablas y accesorios', '2023-08-10', '2023-08-10'),
('Taller de iniciación al skate', 'Aprende los fundamentos del skateboarding con nuestros instructores', '2023-09-05', '2023-09-06');

-- Tabla de FAQ
CREATE TABLE IF NOT EXISTS faq (
  id SERIAL PRIMARY KEY,
  pregunta TEXT NOT NULL,
  respuesta TEXT NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar FAQ de ejemplo
INSERT INTO faq (pregunta, respuesta) VALUES
('¿Cuánto tiempo tarda el envío?', 'Los envíos nacionales suelen tardar entre 2-3 días laborables. Para envíos internacionales, el tiempo estimado es de 5-10 días.'),
('¿Puedo devolver un producto?', 'Sí, aceptamos devoluciones dentro de los 14 días posteriores a la recepción del producto. El producto debe estar sin usar y en su embalaje original.'),
('¿Ofrecen garantía?', 'Todos nuestros productos tienen una garantía de 2 años contra defectos de fabricación.'),
('¿Tienen tienda física?', 'Sí, nuestra tienda física está ubicada en Calle Ejemplo, 123, Madrid. Horario: Lunes a Viernes de 10:00 a 20:00.'),
('¿Hacen envíos internacionales?', 'Sí, realizamos envíos a toda Europa y algunos países de América Latina. Consulta los gastos de envío específicos para tu país.');

-- Tabla de bloques de inicio
CREATE TABLE IF NOT EXISTS home_blocks (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL,
  contenido JSONB,
  orden INTEGER DEFAULT 0,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar bloques de inicio de ejemplo
INSERT INTO home_blocks (titulo, descripcion, tipo, contenido, orden) VALUES
('Productos destacados', 'Nuestra selección de los mejores productos', 'productos', '{"ids": ["1", "2", "3", "4"]}', 1),
('Categorías populares', 'Explora nuestras categorías más populares', 'categorias', '{"categorias": ["Tablas", "Ruedas", "Ejes", "Ropa"]}', 2),
('Testimonios de clientes', 'Lo que dicen nuestros clientes', 'testimonios', '{"testimonios": [{"nombre": "Juan", "texto": "Excelente servicio y productos de calidad."}, {"nombre": "María", "texto": "Envío rápido y buena atención al cliente."}]}', 3);
