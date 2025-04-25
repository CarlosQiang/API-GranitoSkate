import { Pool } from "@neondatabase/serverless"
import { createPool } from "@vercel/postgres"
import { sql as kyselySql } from "kysely"

// Crear un pool de conexiones reutilizable
let pool: Pool

export async function getConnection() {
  try {
    if (!pool) {
      // Verificar si estamos en Vercel
      if (process.env.VERCEL) {
        pool = createPool({
          connectionString: process.env.POSTGRES_URL,
          ssl: {
            rejectUnauthorized: false,
          },
        })
      } else {
        // Conexión local o desarrollo
        pool = new Pool({
          connectionString: process.env.POSTGRES_URL,
          ssl:
            process.env.NODE_ENV === "production"
              ? {
                  rejectUnauthorized: false,
                }
              : undefined,
        })
      }
    }

    return pool
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error)
    throw new Error("No se pudo establecer conexión con la base de datos")
  }
}

// Función para ejecutar consultas SQL
export async function query(text: string, params?: any[]) {
  try {
    const client = await getConnection()
    return await client.query(text, params)
  } catch (error) {
    console.error("Error al ejecutar consulta:", error)
    throw error
  }
}

// Función para verificar la conexión a la base de datos
export async function checkDatabaseConnection() {
  try {
    const result = await query(`SELECT 1 as connection_test`)
    console.log("✅ Conexión a la base de datos establecida correctamente")
    return true
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error)
    return false
  }
}

// Mantener compatibilidad con código existente
export const queryApp = query
export const queryTheme = query

export const sql = kyselySql
