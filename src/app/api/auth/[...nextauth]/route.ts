import NextAuth from "next-auth"
import { authConfig } from "@/src/auth.config"

const { handlers } = NextAuth(authConfig)

export const { GET, POST } = handlers
