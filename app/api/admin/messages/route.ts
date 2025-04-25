import { type NextRequest, NextResponse } from "next/server"
import { queryApp } from "../../db"

// Obtener todos los mensajes
export async function GET(request: NextRequest) {
  try {
    // Verificar si la tabla existe y crearla si no
    try {
      await queryApp("SELECT 1 FROM mensajes LIMIT 1")
    } catch (error) {
      console.log("Creando tabla mensajes...")
      await queryApp(`
        CREATE TABLE IF NOT EXISTS mensajes (
          id SERIAL PRIMARY KEY,
          usuario_id TEXT,
          asunto TEXT NOT NULL,
          mensaje TEXT NOT NULL,
          respuesta_admin TEXT,
          estado TEXT DEFAULT 'pendiente',
          fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `)
      // Insertar datos de ejemplo
      await createSampleMessages()
    }

    const query = "SELECT * FROM mensajes ORDER BY fecha_envio DESC"
    const result = await queryApp(query)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error al obtener mensajes:", error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

// Responder a un mensaje
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, respuesta_admin, admin_nombre } = body

    if (!id || !respuesta_admin || !admin_nombre) {
      return NextResponse.json({ error: "ID de mensaje, respuesta y nombre de admin son requeridos" }, { status: 400 })
    }

    // Actualizar mensaje
    const queryMsg = `
      UPDATE mensajes
      SET respuesta_admin = $1, estado = 'respondido'
      WHERE id = $2
      RETURNING *
    `
    const resultMsg = await queryApp(queryMsg, [respuesta_admin, id])

    if (resultMsg.rows.length === 0) {
      return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 })
    }

    // Registrar acción de administrador
    try {
      const queryAdmin = `
        CREATE TABLE IF NOT EXISTS acciones_admin (
          id SERIAL PRIMARY KEY,
          admin_nombre TEXT NOT NULL,
          tipo_accion TEXT NOT NULL,
          detalles JSONB,
          fecha_accion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      await queryApp(queryAdmin)

      const insertAction = `
        INSERT INTO acciones_admin (admin_nombre, tipo_accion, detalles)
        VALUES ($1, $2, $3)
      `
      await queryApp(insertAction, [
        admin_nombre,
        "respuesta_mensaje",
        JSON.stringify({ mensaje_id: id, respuesta: respuesta_admin }),
      ])
    } catch (error) {
      console.error("Error al registrar acción de administrador:", error)
      // Continuamos aunque falle el registro de la acción
    }

    return NextResponse.json(resultMsg.rows[0])
  } catch (error) {
    console.error("Error al actualizar mensaje:", error)
    return NextResponse.json({ error: "Error al actualizar mensaje" }, { status: 500 })
  }
}

// Función para crear mensajes de ejemplo
async function createSampleMessages() {
  try {
    // Crear mensajes de ejemplo
    const sampleMessages = [
      {
        usuario_id: "1",
        asunto: "Consulta sobre disponibilidad",
        mensaje: "Hola, me gustaría saber si tienen disponible la tabla Element en color negro.",
        estado: "pendiente",
      },
      {
        usuario_id: "2",
        asunto: "Problema con mi pedido",
        mensaje: "Mi pedido #1002 llegó con un artículo dañado. ¿Cómo puedo solicitar un cambio?",
        estado: "pendiente",
      },
      {
        usuario_id: "3",
        asunto: "Devolución",
        mensaje: "Necesito hacer una devolución de mi compra reciente. ¿Cuál es el procedimiento?",
        estado: "pendiente",
      },
      {
        usuario_id: "1",
        asunto: "Información sobre envíos",
        mensaje: "¿Cuánto tiempo tarda un envío a Canarias?",
        estado: "pendiente",
      },
      {
        usuario_id: "4",
        asunto: "Descuento para clubs",
        mensaje: "Represento a un club de skate local. ¿Ofrecen descuentos para compras al por mayor?",
        estado: "pendiente",
      },
    ]

    for (const message of sampleMessages) {
      await queryApp(
        `
        INSERT INTO mensajes (usuario_id, asunto, mensaje, estado)
        VALUES ($1, $2, $3, $4)
      `,
        [message.usuario_id, message.asunto, message.mensaje, message.estado],
      )
    }

    console.log("Mensajes de ejemplo creados correctamente")
  } catch (error) {
    console.error("Error al crear mensajes de ejemplo:", error)
    throw error
  }
}
