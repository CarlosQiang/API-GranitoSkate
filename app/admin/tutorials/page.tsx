"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react"

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true)
        setError(null)

        // Añadimos un timestamp para evitar caché
        const timestamp = new Date().getTime()
        console.log("Fetching tutorials with timestamp:", timestamp)
        const response = await fetch(`/api/admin/tutorials?t=${timestamp}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Error en respuesta:", response.status, errorText)
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Datos recibidos:", data)

        if (Array.isArray(data)) {
          setTutorials(data)
        } else {
          console.error("Formato de datos incorrecto:", data)
          setTutorials([])
        }
      } catch (err) {
        console.error("Error al cargar tutoriales:", err)
        setError(err.message || "Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchTutorials()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este tutorial?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/tutorials/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el tutorial")
      }

      setTutorials(tutorials.filter((tutorial) => tutorial.id !== id))
    } catch (err) {
      console.error("Error al eliminar:", err)
      alert("Error al eliminar el tutorial")
    }
  }

  const filteredTutorials = tutorials.filter(
    (tutorial) =>
      tutorial.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.nivel?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tutoriales</h1>
        <Link
          href="/admin/tutorials/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Tutorial
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por título o nivel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTutorials.length > 0 ? (
                  filteredTutorials.map((tutorial) => (
                    <tr key={tutorial.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tutorial.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tutorial.titulo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tutorial.nivel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/tutorials/edit/${tutorial.id}`}
                            className="text-primary bg-primary/10 hover:bg-primary/20 p-2 rounded-md"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(tutorial.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? "No se encontraron resultados" : "No hay tutoriales disponibles"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
