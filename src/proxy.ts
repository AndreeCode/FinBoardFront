import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const authToken = req.cookies.get('auth_token')
  const isLoggedIn = !!authToken

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
