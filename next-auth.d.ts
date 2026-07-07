import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      authToken: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    authToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    authToken: string
  }
}