"use client"

import type React from "react"
import { useEffect } from "react"
import { createApp } from "@shopify/app-bridge"
import { getSessionToken } from "@shopify/app-bridge-utils"

interface ShopifyAppBridgeProps {
  children: React.ReactNode
}

export default function ShopifyAppBridge({ children }: ShopifyAppBridgeProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const host = urlParams.get("host")
      const shop = urlParams.get("shop")

      if (host && shop) {
        // Usar la variable de entorno pública
        const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || ""

        if (!apiKey) {
          console.error("Error: NEXT_PUBLIC_SHOPIFY_API_KEY no está definida")
          return
        }

        const app = createApp({
          apiKey: apiKey,
          host,
          forceRedirect: true,
        })
        ;(window as Record<string, unknown>).shopifyAppBridge = app

        getSessionToken(app)
          .then((token) => {
            localStorage.setItem("shopifySessionToken", token)
          })
          .catch((err) => {
            console.error("Error al obtener token de sesión:", err)
          })
      }
    }
  }, [])

  return <>{children}</>
}
