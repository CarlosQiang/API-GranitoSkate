import { sql } from "@/app/api/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
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
  try {
    const id = params.id
    const body = await request.json()
    const { nombre_cliente, id_producto, valoracion, comentario, fecha_creacion } = body

    if (!nombre_cliente || !id_producto || !valoracion || !comentario) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await sql`
      UPDATE resenas
      SET nombre_cliente = ${nombre_cliente}, id_producto = ${id_producto}, 
          valoracion = ${valoracion}, comentario = ${comentario}, 
          fecha_creacion = ${fecha_creacion}
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
  try {
    const id = params.id
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
