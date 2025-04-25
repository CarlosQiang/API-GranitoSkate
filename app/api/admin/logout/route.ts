import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const cookieStore = cookies()

  // Eliminar la cookie de sesión
  cookieStore.delete("admin_session")

  return NextResponse.json({ success: true })
}
