"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"

export default function NewTutorialPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [jsonError, setJsonError] = useState("")

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    nivel: "principiante",
    video_url: "",
    imagen_url: "",
    contenido: "",
    pasos: [],
  })

  const [pasosText, setPasosText] = useState("[]")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasosChange = (e) => {
    setPasosText(e.target.value)
    try {
      // Intentamos parsear el JSON o creamos un array vacío si está en blanco
      const pasos = e.target.value.trim() ? JSON.parse(e.target.value) : []
      setFormData((prev) => ({ ...prev, pasos }))
      setJsonError("")
    } catch (error) {
      console.error("Error al parsear JSON de pasos:", error)
      setJsonError("Error en el formato JSON. Por favor, verifica la sintaxis.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Verificar si hay error en el JSON
    if (jsonError) {
      alert("Por favor, corrige el formato JSON de los pasos antes de continuar.")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Enviando datos:", formData)

      const response = await fetch("/api/admin/tutorials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al crear el tutorial")
      }

      router.push("/admin/tutorials")
    } catch (error) {
      console.error("Error:", error)
      setError(error.message || "Error al crear el tutorial")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/tutorials" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">Nuevo Tutorial</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
              <select
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL del Video</label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
              <input
                type="url"
                name="imagen_url"
                value={formData.imagen_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
              <textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pasos (formato JSON)
                {jsonError && <span className="text-red-500 ml-2 text-xs">{jsonError}</span>}
              </label>
              <textarea
                name="pasos_json"
                value={pasosText}
                onChange={handlePasosChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md font-mono text-sm ${
                  jsonError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder='[{"paso": "Paso 1", "descripcion": "Descripción del paso 1"}, ...]'
              />
              <p className="text-xs text-gray-500 mt-1">
                Ingresa los pasos en formato JSON como un array de objetos. Ejemplo:
                <br />
                <code>[{`{"paso": "Paso 1", "descripcion": "Descripción del paso 1"}`}]</code>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading || jsonError !== ""}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md flex items-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Guardar Tutorial
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
