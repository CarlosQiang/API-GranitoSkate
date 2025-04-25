import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"

export async function GET() {
  try {
    // Verificar la conexión a la base de datos
    await sql`SELECT 1`

    // Crear tablas
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES ('admin', '$2b$10$X7o4c5Qh.9QyXOYUB.2H2eO/3xO7WFl9g5VXCyqXH5Xd4wQlYlVwW')
      ON CONFLICT (username) DO NOTHING
    `

    await sql`
      CREATE TABLE IF NOT EXISTS shopify_tokens (
        id SERIAL PRIMARY KEY,
        shop TEXT NOT NULL UNIQUE,
        access_token TEXT NOT NULL,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

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

    await sql`
      CREATE TABLE IF NOT EXISTS faq (
        id SERIAL PRIMARY KEY,
        pregunta TEXT NOT NULL,
        respuesta TEXT NOT NULL,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

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

    await sql`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        shopify_customer_id TEXT UNIQUE,
        email TEXT NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

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

    await sql`
      CREATE TABLE IF NOT EXISTS visitas (
        id SERIAL PRIMARY KEY,
        usuario_id TEXT,
        id_producto TEXT NOT NULL,
        fecha_visita TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS theme_config (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Insertar token de Shopify si existe en las variables de entorno
    if (process.env.SHOPIFY_SHOP_URL && process.env.SHOPIFY_ACCESS_TOKEN) {
      await sql`
        INSERT INTO shopify_tokens (shop, access_token)
        VALUES (${process.env.SHOPIFY_SHOP_URL}, ${process.env.SHOPIFY_ACCESS_TOKEN})
        ON CONFLICT (shop) DO UPDATE SET access_token = ${process.env.SHOPIFY_ACCESS_TOKEN}
      `
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos inicializada correctamente",
    })
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al inicializar la base de datos: " + (error as Error).message,
      },
      { status: 500 },
    )
  }
}
