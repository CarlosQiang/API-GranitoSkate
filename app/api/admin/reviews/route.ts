import { type NextRequest, NextResponse } from "next/server"
import { queryTheme } from "../../db"
import { sql } from "@/app/api/db"

export async function GET() {
  try {
    const reviews = await sql`SELECT * FROM resenas ORDER BY fecha_creacion DESC`
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error al obtener reseñas:", error)
    return NextResponse.json({ error: "Error al obtener reseñas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre_cliente, id_producto, valoracion, comentario, fecha_creacion } = body

    if (!nombre_cliente || !id_producto || !valoracion || !comentario) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO resenas (nombre_cliente, id_producto, valoracion, comentario, fecha_creacion)
      VALUES (${nombre_cliente}, ${id_producto}, ${valoracion}, ${comentario}, ${fecha_creacion || new Date()})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear reseña:", error)
    return NextResponse.json({ error: "Error al crear reseña" }, { status: 500 })
  }
}

// Aprobar o rechazar una reseña
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, aprobada } = body

    if (!id) {
      return NextResponse.json({ error: "ID de reseña requerido" }, { status: 400 })
    }

    const query = `
      UPDATE resenas
      SET aprobada = $1
      WHERE id = $2
      RETURNING *
    `

    const result = await queryTheme(query, [aprobada, id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error al actualizar reseña:", error)
    return NextResponse.json({ error: "Error al actualizar reseña" }, { status: 500 })
  }
}

// Eliminar una reseña
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID de reseña requerido" }, { status: 400 })
  }

  try {
    const query = "DELETE FROM resenas WHERE id = $1 RETURNING *"
    const result = await queryTheme(query, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Reseña eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar reseña:", error)
    return NextResponse.json({ error: "Error al eliminar reseña" }, { status: 500 })
  }
}

// Función para crear reseñas de ejemplo
async function createSampleReviews() {
  try {
    // Crear reseñas de ejemplo
    const sampleReviews = [
      {
        nombre_cliente: "Juan Pérez",
        id_producto: "1",
        valoracion: 5,
        comentario: "Excelente tabla, muy resistente y con buen pop.",
        aprobada: true,
      },
      {
        nombre_cliente: "María García",
        id_producto: "1",
        valoracion: 4,
        comentario: "Buena tabla, aunque un poco cara para mi gusto.",
        aprobada: true,
      },
      {
        nombre_cliente: "Carlos López",
        id_producto: "2",
        valoracion: 5,
        comentario: "Las mejores ruedas que he probado, muy duraderas.",
        aprobada: true,
      },
      {
        nombre_cliente: "Ana Martínez",
        id_producto: "3",
        valoracion: 3,
        comentario: "Ejes de calidad media, esperaba algo mejor por el precio.",
        aprobada: false,
      },
      {
        nombre_cliente: "Pedro Sánchez",
        id_producto: "2",
        valoracion: 4,
        comentario: "Buenas ruedas para street, recomendadas.",
        aprobada: true,
      },
      {
        nombre_cliente: "Laura Rodríguez",
        id_producto: "1",
        valoracion: 5,
        comentario: "Tabla perfecta para principiantes y avanzados.",
        aprobada: true,
      },
      {
        nombre_cliente: "Miguel Fernández",
        id_producto: "3",
        valoracion: 4,
        comentario: "Buenos ejes, aunque un poco pesados.",
        aprobada: true,
      },
      {
        nombre_cliente: "Sofía Gómez",
        id_producto: "2",
        valoracion: 5,
        comentario: "Excelentes ruedas, muy buena relación calidad-precio.",
        aprobada: true,
      },
      {
        nombre_cliente: "Javier Torres",
        id_producto: "1",
        valoracion: 2,
        comentario: "La tabla se astilló después de un mes de uso.",
        aprobada: false,
      },
      {
        nombre_cliente: "Elena Díaz",
        id_producto: "3",
        valoracion: 5,
        comentario: "Los mejores ejes del mercado, muy duraderos.",
        aprobada: true,
      },
      {
        nombre_cliente: "Roberto Ruiz",
        id_producto: "2",
        valoracion: 4,
        comentario: "Buenas ruedas para park, recomendadas.",
        aprobada: true,
      },
      {
        nombre_cliente: "Carmen Jiménez",
        id_producto: "1",
        valoracion: 5,
        comentario: "Tabla con excelente pop y muy ligera.",
        aprobada: true,
      },
    ]

    for (const review of sampleReviews) {
      await queryTheme(
        `
        INSERT INTO resenas (nombre_cliente, id_producto, valoracion, comentario, aprobada)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [review.nombre_cliente, review.id_producto, review.valoracion, review.comentario, review.aprobada],
      )
    }

    console.log("Reseñas de ejemplo creadas correctamente")
  } catch (error) {
    console.error("Error al crear reseñas de ejemplo:", error)
    throw error
  }
}
