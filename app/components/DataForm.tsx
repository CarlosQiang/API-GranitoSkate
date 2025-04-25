"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Field {
  name: string
  label: string
  type: "text" | "textarea" | "number" | "date" | "select" | "url" | "checkbox" | "json"
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  min?: number
  max?: number
  rows?: number
}

interface DataFormProps {
  title: string
  endpoint: string
  fields: Field[]
  id?: string
  returnPath: string
  isEdit?: boolean
}

export default function DataForm({ title, endpoint, fields, id, returnPath, isEdit = false }: DataFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (isEdit && id) {
      fetchData()
    } else {
      // Initialize form with empty values
      const initialData: Record<string, any> = {}
      fields.forEach((field) => {
        initialData[field.name] = field.type === "checkbox" ? false : ""
      })
      setFormData(initialData)
      setLoading(false)
    }
  }, [isEdit, id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/${endpoint}/${id}`)

      if (!response.ok) {
        throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setFormData(data)
    } catch (error) {
      console.error("Error:", error)
      setError(`Error al cargar los datos. Por favor, intenta de nuevo. (${error.message})`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleJsonChange = (name: string, value: string) => {
    try {
      // Try to parse as JSON if it's a valid JSON string
      const jsonValue = value.trim() ? JSON.parse(value) : {}
      setFormData({
        ...formData,
        [name]: jsonValue,
      })
    } catch (e) {
      // If it's not valid JSON, store as string
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const method = isEdit ? "PUT" : "POST"
      const url = isEdit ? `/api/admin/${endpoint}/${id}` : `/api/admin/${endpoint}`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error al ${isEdit ? "actualizar" : "crear"} elemento`)
      }

      // Redirect back to list
      router.push(returnPath)
      router.refresh()
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || `Error al ${isEdit ? "actualizar" : "crear"} elemento`)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href={returnPath} className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" || field.type === "json" ? "col-span-2" : undefined}
              >
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === "textarea" && (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    rows={field.rows || 4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}

                {field.type === "json" && (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={
                      typeof formData[field.name] === "object"
                        ? JSON.stringify(formData[field.name], null, 2)
                        : formData[field.name] || ""
                    }
                    onChange={(e) => handleJsonChange(field.name, e.target.value)}
                    rows={field.rows || 8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    placeholder={field.placeholder || '{ "key": "value" }'}
                    required={field.required}
                  />
                )}

                {field.type === "select" && (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required={field.required}
                  >
                    <option value="">Seleccionar</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center h-5">
                    <input
                      id={field.name}
                      name={field.name}
                      type="checkbox"
                      checked={formData[field.name] || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900">
                      {field.label}
                    </label>
                  </div>
                )}

                {(field.type === "text" ||
                  field.type === "number" ||
                  field.type === "date" ||
                  field.type === "url") && (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    min={field.min}
                    max={field.max}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href={returnPath}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
