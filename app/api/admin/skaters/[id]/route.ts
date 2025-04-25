import { NextResponse } from "next/server"
import { sql } from "@/app/api/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de skater requerido" }, { status: 400 })
  }

  try {
    const skater = await sql`SELECT * FROM skaters WHERE id = ${id}`

    if (skater.length === 0) {
      return NextResponse.json({ error: "Skater no encontrado" }, { status: 404 })
    }

    return NextResponse.json(skater[0])
  } catch (error) {
    console.error("Error al obtener skater:", error)
    return NextResponse.json({ error: "Error al obtener skater" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de skater requerido" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { nombre, estilo, edad, ciudad, pais, biografia, logros, imagen_url } = body

    const result = await sql`
      UPDATE skaters
      SET nombre = ${nombre}, estilo = ${estilo}, edad = ${edad}, 
          ciudad = ${ciudad}, pais = ${pais}, biografia = ${biografia}, 
          logros = ${logros}, imagen_url = ${imagen_url}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Skater no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al actualizar skater:", error)
    return NextResponse.json({ error: "Error al actualizar skater" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "ID de skater requerido" }, { status: 400 })
  }

  try {
    const result = await sql`DELETE FROM skaters WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Skater no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Skater eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar skater:", error)
    return NextResponse.json({ error: "Error al eliminar skater" }, { status: 500 })
  }
}
