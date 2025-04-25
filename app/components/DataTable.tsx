"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/${endpoint}`)

      if (!response.ok) {
        throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error:", error)
      setError(`Error al cargar los datos. Por favor, intenta de nuevo. (${error.message})`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/${endpoint}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar: ${response.status} ${response.statusText}`)
      }

      // Actualizar la lista después de eliminar
      fetchData()
    } catch (error) {
      console.error("Error:", error)
      alert(`Error al eliminar el elemento: ${error.message}`)
    }
  }

  // Filtrar datos según el término de búsqueda
  const filteredData = data.filter((item) => {
    return columns.some((column) => {
      const value = item[column.key]
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Formatear valor para mostrar
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "-"

    // Si es un objeto JSON, mostrarlo como string
    if (typeof value === "object") {
      return JSON.stringify(value).substring(0, 50) + "..."
    }

    // Si es una fecha, formatearla
    if (value.toString().match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(value).toLocaleDateString()
    }

    // Si es un string largo, truncarlo
    if (typeof value === "string" && value.length > 50) {
      return value.substring(0, 50) + "..."
    }

    return value.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <Link
          href={createPath}
          className="px-4 py-2 bg-primary-500 text-white rounded-md flex items-center hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear nuevo
        </Link>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

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
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatValue(item[column.key])}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/${endpoint}/edit/${item.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
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
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredData.length > itemsPerPage && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredData.length)}</span> de{" "}
                  <span className="font-medium">{filteredData.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === page
                          ? "bg-primary-50 border-primary-500 text-primary-600 z-10"
                          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                      } text-sm font-medium`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Siguiente</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
