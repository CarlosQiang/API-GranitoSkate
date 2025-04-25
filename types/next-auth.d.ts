declare module "next-auth" {
  /**
   * Extiende el tipo User por defecto
   */
  interface User {
    id: string
    shopifyCustomerId?: string
  }

  /**
   * Extiende el tipo Session por defecto
   */
  interface Session {
    user: {
      id: string
      shopifyCustomerId?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  /** Extiende el tipo JWT por defecto */
  interface JWT {
    id: string
    shopifyCustomerId?: string
  }
}
