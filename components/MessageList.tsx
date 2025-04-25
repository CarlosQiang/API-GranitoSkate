"use client"

import { useState, useEffect } from "react"

export const MessageList = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [adminName, setAdminName] = useState("Admin") // Puedes obtener esto del usuario logueado

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/messages")

      if (!response.ok) {
        throw new Error("Error al cargar mensajes")
      }

      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error:", error)
      setError("Error al cargar los mensajes. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleReply = (message) => {
    setSelectedMessage(message)
    setReplyText(message.respuesta_admin || "") // Cargar respuesta existente
  }

  const handleSendReply = async () => {
    if (!selectedMessage) return

    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedMessage.id,
          respuesta_admin: replyText,
          admin_nombre: adminName,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al enviar respuesta")
      }

      // Actualizar la lista de mensajes
      fetchMessages()
      setSelectedMessage(null) // Cerrar el formulario de respuesta
    } catch (error) {
      console.error("Error:", error)
      setError("Error al enviar la respuesta. Por favor, intenta de nuevo.")
    }
  }

  const handleCloseReply = () => {
    setSelectedMessage(null)
  }

  if (loading) {
    return <div className="p-4">Cargando mensajes...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asunto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {messages.map((message) => (
            <tr key={message.id}>
              <td className="px-6 py-4 whitespace-nowrap">{message.asunto}</td>
              <td className="px-6 py-4">{message.mensaje}</td>
              <td className="px-6 py-4 whitespace-nowrap">{message.estado}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {message.estado === "pendiente" ? (
                  <button onClick={() => handleReply(message)} className="text-primary-600 hover:text-primary-900">
                    Responder
                  </button>
                ) : (
                  <span className="text-gray-500">Respondido</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Responder a: {selectedMessage.asunto}</h3>
              <div className="px-7 py-3">
                <textarea
                  className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  rows="3"
                  placeholder="Escribe tu respuesta aquí"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={handleSendReply}
                >
                  Enviar Respuesta
                </button>
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={handleCloseReply}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
