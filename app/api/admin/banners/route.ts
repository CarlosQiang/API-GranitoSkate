import { type NextRequest, NextResponse } from "next/server"
import { queryTheme } from "../../db"
import { sql } from "@/app/api/db"

// Obtener todos los banners
export async function GET() {
  try {
    const banners = await sql`SELECT * FROM banners ORDER BY orden ASC`
    return NextResponse.json(banners)
  } catch (error) {
    console.error("Error al obtener banners:", error)
    return NextResponse.json({ error: "Error al obtener banners" }, { status: 500 })
  }
}

// Crear un nuevo banner
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { titulo, imagen_url, enlace, orden } = body

    if (!titulo || !imagen_url || !enlace) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO banners (titulo, imagen_url, enlace, orden)
      VALUES (${titulo}, ${imagen_url}, ${enlace}, ${orden})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear banner:", error)
    return NextResponse.json({ error: "Error al crear banner" }, { status: 500 })
  }
}

// Actualizar un banner
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, titulo, subtitulo, imagen_url, enlace, orden } = body

    if (!id) {
      return NextResponse.json({ error: "ID de banner requerido" }, { status: 400 })
    }

    const query = `
      UPDATE banners
      SET titulo = $1, subtitulo = $2, imagen_url = $3, enlace = $4, orden = $5
      WHERE id = $6
      RETURNING *
    `

    const result = await queryTheme(query, [titulo, subtitulo, imagen_url, enlace, orden, id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Banner no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error al actualizar banner:", error)
    return NextResponse.json({ error: "Error al actualizar banner" }, { status: 500 })
  }
}

// Eliminar un banner
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de banner requerido" }, { status: 400 })
  }

  try {
    const query = "DELETE FROM banners WHERE id = $1 RETURNING *"
    const result = await queryTheme(query, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Banner no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Banner eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar banner:", error)
    return NextResponse.json({ error: "Error al eliminar banner" }, { status: 500 })
  }
}

// Función para crear banners de ejemplo
async function createSampleBanners() {
  try {
    // Crear banners de ejemplo
    const sampleBanners = [
      {
        titulo: "Nueva colección de tablas",
        subtitulo: "Descubre las últimas novedades en tablas de skate",
        imagen_url: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1200&h=400&fit=crop",
        enlace: "/collections/tablas",
        orden: 1,
      },
      {
        titulo: "Ofertas en ruedas",
        subtitulo: "Hasta 30% de descuento en ruedas Spitfire",
        imagen_url: "https://images.unsplash.com/photo-1531565637446-32307b194362?w=1200&h=400&fit=crop",
        enlace: "/collections/ruedas",
        orden: 2,
      },
      {
        titulo: "Accesorios premium",
        subtitulo: "La mejor selección de accesorios para tu skate",
        imagen_url: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=1200&h=400&fit=crop",
        enlace: "/collections/accesorios",
        orden: 3,
      },
    ]

    for (const banner of sampleBanners) {
      await queryTheme(
        `
        INSERT INTO banners (titulo, subtitulo, imagen_url, enlace, orden)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [banner.titulo, banner.subtitulo, banner.imagen_url, banner.enlace, banner.orden],
      )
    }

    console.log("Banners de ejemplo creados correctamente")
  } catch (error) {
    console.error("Error al crear banners de ejemplo:", error)
    throw error
  }
}
