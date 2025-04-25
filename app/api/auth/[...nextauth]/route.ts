import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { queryApp } from "../../db"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Shopify",
      credentials: {
        email: { label: "Email", type: "email" },
        shopifyCustomerId: { label: "Shopify Customer ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.shopifyCustomerId) {
          return null
        }

        try {
          // Buscar usuario por email y shopify_customer_id
          const result = await queryApp("SELECT * FROM usuarios WHERE email = $1 AND shopify_customer_id = $2", [
            credentials.email,
            credentials.shopifyCustomerId,
          ])

          const user = result.rows[0]

          if (!user) {
            // Si no existe, crear nuevo usuario
            const newUserResult = await queryApp(
              "INSERT INTO usuarios (email, shopify_customer_id, nombre) VALUES ($1, $2, $3) RETURNING *",
              [credentials.email, credentials.shopifyCustomerId, credentials.email.split("@")[0]],
            )
            return newUserResult.rows[0]
          }

          return user
        } catch (error) {
          console.error("Error en autenticación:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.shopifyCustomerId = user.shopify_customer_id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.shopifyCustomerId = token.shopifyCustomerId as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
