import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          })

          if (!res.ok) return null

          const result = await res.json()
          const { data } = result

          if (!data?.user) return null

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            authToken: data.token,
          }
        } catch (err) {
          console.log("ERROR AUTH:", err)
          return null
        }
      },
    }),
  ],

  session: { strategy: "jwt", maxAge: 60 * 60 * 2 },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.authToken = (user as any).authToken
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.authToken = token.authToken as string
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
}