'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/src/components/auth/auth-card'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setIsLoading(false)
        toast.error(data.error || 'Credenciales inválidas')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setIsLoading(false)
      toast.error('Error al conectar con el servidor')
    }
  }

  return (
    <>
      <AuthCard
        title="Inicia Sesión"
        description="Accede a tu cuenta y gestiona tus finanzas"
        footerText="¿No tienes cuenta?"
        footerLink={{
          href: '/register',
          text: 'Regístrate aquí',
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Correo electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" disabled={isLoading}>
            Google
          </Button>
          <Button type="button" variant="outline" disabled={isLoading}>
            GitHub
          </Button>
        </div>

        <div className="text-center">
          <a href="#" className="text-xs text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </AuthCard>
    </>
  )
}
