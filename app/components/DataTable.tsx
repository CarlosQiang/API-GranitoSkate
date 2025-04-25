"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Plus } from "lucide-react"

interface Column {
  key: string
  label: string
}

interface DataTableProps {
  title: string
  endpoint: string
  columns: Column[]
  createPath: string
}

export default function DataTable({ title, endpoint, columns, createPath }: DataTableProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [endpoint])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/${endpoint}`)

      if (!response.ok) {
        throw new Error(`Error al cargar datos de ${endpoint}`)
      }

      const result = await response.json()
      setData(Array.isArray(result) ? result : [])
    } catch (error) {
      console.error("Error:", error)
      setError(`Error al cargar los datos de ${title.toLowerCase()}. Por favor, intenta de nuevo.`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar este elemento de ${title.toLowerCase()}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/${endpoint}?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Error al eliminar ${title.toLowerCase()}`)
      }

      // Refresh the data
      fetchData()
    } catch (error: any) {
      console.error("Error:", error)
      alert(error.message || `Error al eliminar ${title.toLowerCase()}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Asegurarse de que la ruta de edición sea correcta
  const getEditPath = (id: string) => {
    return `${createPath.replace("/new", "")}/edit/${id}`
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <Link
          href={createPath}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo {title.slice(0, -1)}
        </Link>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={`${item.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item[column.key]}</div>
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={getEditPath(item.id)} className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay {title.toLowerCase()} disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
