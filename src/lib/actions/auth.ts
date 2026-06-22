'use server'

import { signIn, signOut } from '@/src/auth'
import { redirect } from 'next/navigation'

export async function login(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    return { error: 'Credenciales inválidas. Verifica tu email y contraseña.' }
  }

  redirect('/dashboard')
}

export async function logout() {
  await signOut({ redirectTo: '/login' })
}

export async function oauthLogin(provider: string) {
  await signIn(provider, { redirectTo: '/dashboard' })
}
