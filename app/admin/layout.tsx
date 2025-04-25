import type React from "react"
import Sidebar from "../components/Sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto md:ml-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
