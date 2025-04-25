-- Crear tabla para almacenar tokens de acceso de Shopify
CREATE TABLE IF NOT EXISTS shopify_tokens (
  id SERIAL PRIMARY KEY,
  shop TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
