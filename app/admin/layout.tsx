import type React from "react"
import Sidebar from "@/app/components/Sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="transition-all duration-300 ease-in-out md:pl-64">
        <main className="min-h-screen p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
