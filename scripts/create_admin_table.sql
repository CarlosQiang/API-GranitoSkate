-- Crear tabla de administradores
CREATE TABLE IF NOT EXISTS administradores (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'editor', -- 'admin', 'editor', 'viewer'
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar un administrador por defecto
INSERT INTO administradores (email, nombre, rol)
VALUES ('admin@granitoskate.com', 'Administrador Principal', 'admin');
