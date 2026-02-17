'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/src/components/auth/auth-card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('[v0] Login attempt:', {
      email: formData.email,
      password: formData.password,
      timestamp: new Date().toISOString(),
    });

    setTimeout(() => {
      setIsLoading(false);
      console.log('[v0] Redirecting to dashboard');
      router.push('/dashboard');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    console.log('[v0] Google login clicked');
  };

  const handleGithubLogin = () => {
    console.log('[v0] GitHub login clicked');
  };

  return (
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
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
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
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleGithubLogin}
          disabled={isLoading}
        >
          GitHub
        </Button>
      </div>

      <div className="text-center">
        <a href="#" className="text-xs text-primary hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </AuthCard>
  );
}
