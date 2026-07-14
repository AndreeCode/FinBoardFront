import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json()

    const nameParts = fullName.trim().split(' ')
    const name = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const res = await fetch(`${process.env.BACKEND_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        last_name: lastName,
        email,
        password,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      return NextResponse.json(
        { error: data.msg || 'Error al crear la cuenta' },
        { status: 400 }
      )
    }

    const loginRes = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!loginRes.ok) {
      return NextResponse.json(
        { error: 'Cuenta creada pero error al iniciar sesión' },
        { status: 500 }
      )
    }

    const setCookie = loginRes.headers.get('set-cookie')
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
      secure: request.headers.get('x-forwarded-proto') === 'https',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2,
      path: '/',
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al conectar con el servidor' },
      { status: 500 }
    )
  }
}
