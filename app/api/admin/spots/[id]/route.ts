import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de spot requerido" }, { status: 400 })
  }

  try {
    const spot = await sql`SELECT * FROM spots WHERE id = ${id}`

    if (spot.length === 0) {
      return NextResponse.json({ error: "Spot no encontrado" }, { status: 404 })
    }

    return NextResponse.json(spot[0])
  } catch (error) {
    console.error("Error al obtener spot:", error)
    return NextResponse.json({ error: "Error al obtener spot" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de spot requerido" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { nombre, tipo, ciudad, direccion, descripcion, mapa_iframe, imagen_url } = body

    const result = await sql`
      UPDATE spots
      SET nombre = ${nombre}, tipo = ${tipo}, ciudad = ${ciudad}, 
          direccion = ${direccion}, descripcion = ${descripcion}, 
          mapa_iframe = ${mapa_iframe}, imagen_url = ${imagen_url}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Spot no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar spot:", error)
    return NextResponse.json({ error: "Error al actualizar spot" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de spot requerido" }, { status: 400 })
  }

  try {
    const result = await sql`DELETE FROM spots WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Spot no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Spot eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar spot:", error)
    return NextResponse.json({ error: "Error al eliminar spot" }, { status: 500 })
  }
}
