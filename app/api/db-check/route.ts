import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/app/api/db"

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection()

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: "Conexión a la base de datos establecida correctamente",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "No se pudo conectar a la base de datos",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error verificando conexión a la base de datos:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error verificando conexión a la base de datos: " + (error as Error).message,
      },
      { status: 500 },
    )
  }
}
