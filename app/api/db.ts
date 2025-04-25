import postgres from "postgres"

// Configuración de conexión a la base de datos
const connectionString = process.env.NEON_DATABASE_URL_APP || ""

if (!connectionString) {
  console.error("Error: URL de conexión a la base de datos no proporcionada")
}

// Crear cliente SQL con opciones de conexión mejoradas
export const sql = postgres(connectionString, {
  ssl: "require",
  max: 10, // Máximo de conexiones en el pool
  idle_timeout: 20, // Tiempo de espera en segundos antes de cerrar conexiones inactivas
  connect_timeout: 10, // Tiempo de espera para la conexión en segundos
  connection: {
    application_name: "granito-theme", // Nombre de la aplicación para identificar conexiones
  },
})

// Función de utilidad para ejecutar consultas con manejo de errores
export async function query(text: string, params: any[] = []) {
  try {
    const start = Date.now()
    const result = await sql.unsafe(text, ...params)
    const duration = Date.now() - start
    console.log(`Consulta ejecutada en ${duration}ms: ${text.substring(0, 50)}...`)
    return { rows: result }
  } catch (error) {
    console.error("Error en consulta SQL:", error)
    throw error
  }
}

// Función para verificar la conexión a la base de datos
export async function checkDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 as connection_test`
    console.log("✅ Conexión a la base de datos establecida correctamente")
    return true
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error)
    return false
  }
}

// Alias para mantener compatibilidad con código existente
export const queryApp = query
export const queryTheme = query
