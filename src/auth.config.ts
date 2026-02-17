import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null

        try {
          const res = await fetch(`${process.env.BACKEND_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          })

          if (!res.ok) return null

          const data = await res.json()

          if (!data?.user) return null

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            accessToken: data.accessToken,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.accessToken = (user as any).accessToken
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      ;(session as any).accessToken = token.accessToken
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
