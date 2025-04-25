import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de reseña requerido" }, { status: 400 })
  }

  try {
    const review = await sql`SELECT * FROM resenas WHERE id = ${id}`

    if (review.length === 0) {
      return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 })
    }

    return NextResponse.json(review[0])
  } catch (error) {
    console.error("Error al obtener reseña:", error)
    return NextResponse.json({ error: "Error al obtener reseña" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de reseña requerido" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { nombre_cliente, id_producto, valoracion, comentario, aprobada } = body

    const result = await sql`
      UPDATE resenas
      SET nombre_cliente = ${nombre_cliente}, id_producto = ${id_producto}, 
          valoracion = ${valoracion}, comentario = ${comentario}, aprobada = ${aprobada}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar reseña:", error)
    return NextResponse.json({ error: "Error al actualizar reseña" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de reseña requerido" }, { status: 400 })
  }

  try {
    const result = await sql`DELETE FROM resenas WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Reseña eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar reseña:", error)
    return NextResponse.json({ error: "Error al eliminar reseña" }, { status: 500 })
  }
}
