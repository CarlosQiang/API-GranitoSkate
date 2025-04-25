"use client"

import { useState, useEffect } from "react"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/orders")

      if (!response.ok) {
        throw new Error("Error al cargar pedidos")
      }

      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error:", error)
      setError("Error al cargar los pedidos. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId, status }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar estado")
      }

      // Actualizar la lista de pedidos
      fetchOrders()
    } catch (error) {
      console.error("Error:", error)
      setError("Error al actualizar el estado del pedido. Por favor, intenta de nuevo.")
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "fulfilled":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Enviado
          </span>
        )
      case "unfulfilled":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        )
      case "paid":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Pagado
          </span>
        )
      case "pending":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Pendiente de pago
          </span>
        )
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pedido #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado Pago
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado Envío
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.order_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.customer?.first_name} {order.customer?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{order.customer?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.total_price}€</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.financial_status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.fulfillment_status || "unfulfilled")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(order.id, "fulfilled")}
                            className="text-green-600 hover:text-green-900"
                            disabled={order.fulfillment_status === "fulfilled"}
                          >
                            Marcar como enviado
                          </button>
                          <a
                            href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_URL}/admin/orders/${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Ver en Shopify
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay pedidos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
