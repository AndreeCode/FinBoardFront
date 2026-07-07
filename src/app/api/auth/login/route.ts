import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const { email, password } = JSON.parse(body)

    const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    const setCookie = res.headers.get('set-cookie')
    let token = ''
    if (setCookie) {
      const match = setCookie.match(/auth_token=([^;]+)/)
      if (match) {
        token = match[1]
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Error al iniciar sesión' },
        { status: 500 }
      )
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error al conectar con el servidor' },
      { status: 500 }
    )
  }
}
