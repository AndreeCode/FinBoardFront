// auth.config.ts

import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const res = await fetch(`${process.env.BACKEND_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        })

        const data = await res.json()

        if (!res.ok) return null

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.accessToken = token.accessToken as string
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
