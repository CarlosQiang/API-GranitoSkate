CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nombre_completo TEXT,
  rol TEXT NOT NULL DEFAULT 'editor',
  activo BOOLEAN DEFAULT true,
  ultimo_acceso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin_users (email, username, password_hash, nombre_completo, rol)
VALUES ('admin@granitoskate.com', 'admin', '$2b$10$X7o4c5Qh.9QyXOYUB.2H2eO/3xO7WFl9g5VXCyqXH5Xd4wQlYlVwW', 'Administrador Principal', 'admin');
