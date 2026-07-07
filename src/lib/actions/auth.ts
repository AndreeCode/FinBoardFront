'use server'

import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      return { error: 'Credenciales inválidas. Verifica tu email y contraseña.' }
    }

    const loginData = await res.json()
    const token = loginData.data?.token

    if (token) {
      const cookieStore = await cookies()
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2,
        path: '/',
      })
    }
  } catch (error) {
    return { error: 'Error al conectar con el servidor' }
  }

  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  redirect('/login')
}

export async function oauthLogin(provider: string) {
  redirect(`/api/auth/signin/${provider}`)
}

export async function register(formData: FormData): Promise<{ error?: string }> {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const nameParts = fullName.trim().split(' ')
  const name = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  try {
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
      const result = await res.json()
      return { error: result.msg || 'Error al crear la cuenta' }
    }

    const loginRes = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!loginRes.ok) {
      return { error: 'Cuenta creada pero error al iniciar sesión' }
    }

    const loginData = await loginRes.json()
    const token = loginData.data?.token

    if (token) {
      const cookieStore = await cookies()
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2,
        path: '/',
      })
    }
  } catch (error) {
    return { error: 'Error al conectar con el servidor' }
  }

  redirect('/dashboard')
}
