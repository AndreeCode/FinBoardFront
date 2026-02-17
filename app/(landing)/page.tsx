'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  Wallet,
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
  Users,
  Settings,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleDemoClick = () => {
    console.log('[v0] Demo button clicked - navigating to dashboard');
    router.push('/dashboard');
  };

  const handlePricingClick = () => {
    console.log('[v0] Pricing button clicked');
  };

  const handleContactClick = () => {
    console.log('[v0] Contact button clicked');
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      title: 'Análisis Detallado',
      description: 'Visualiza tus finanzas con gráficos interactivos y reportes en tiempo real.',
    },
    {
      icon: <Wallet className="w-6 h-6 text-primary" />,
      title: 'Gestión Completa',
      description: 'Controla gastos, ingresos, inversiones y préstamos en un solo lugar.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: 'Inversiones',
      description: 'Sigue el rendimiento de tus activos y portfolios de inversión.',
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: 'Seguro y Privado',
      description: 'Tus datos están protegidos con encriptación de grado empresarial.',
    },
  ];

  const testimonials = [
    {
      name: 'Carlos Mendoza',
      role: 'Emprendedor',
      text: 'Esta app cambió completamente cómo manejo mis finanzas. Ahora tengo claridad total sobre mi dinero.',
      avatar: '👨‍💼',
    },
    {
      name: 'María García',
      role: 'Inversora',
      text: 'Los análisis y gráficos me ayudan a tomar mejores decisiones sobre mis inversiones.',
      avatar: '👩‍💼',
    },
    {
      name: 'Juan López',
      role: 'Profesional',
      text: 'Simple, intuitiva y poderosa. Exactamente lo que buscaba para controlar mis gastos.',
      avatar: '👨‍🔬',
    },
  ];

  const pricingPlans = [
    {
      name: 'Básico',
      price: 'Gratis',
      features: [
        'Gestión de gastos e ingresos',
        'Hasta 3 categorías personalizadas',
        'Reportes básicos',
        'Soporte por email',
      ],
      cta: 'Comenzar Gratis',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: 'S/. 29.99',
      period: '/mes',
      features: [
        'Todas las características básicas',
        'Categorías ilimitadas',
        'Análisis avanzado',
        'Seguimiento de inversiones',
        'Soporte prioritario',
        'Exportar reportes en PDF',
      ],
      cta: 'Probar 7 días Gratis',
      highlighted: true,
    },
    {
      name: 'Business',
      price: 'S/. 99.99',
      period: '/mes',
      features: [
        'Todas las características Pro',
        'Múltiples cuentas',
        'Alertas inteligentes',
        'API personalizada',
        'Soporte 24/7',
        'Auditoría personalizada',
      ],
      cta: 'Contactar Ventas',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">MiFinanzas</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Características
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
              Precios
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition">
              Testimonios
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Lanzamiento 2026 - Acceso Temprano
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Controla tus finanzas como nunca antes
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Gestiona gastos, ingresos, inversiones y préstamos en un dashboard intuitivo y poderoso. Visualiza tu dinero con análisis detallados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleDemoClick}
                className="bg-primary hover:bg-primary/90 text-base px-6"
              >
                Ver Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link href="/register">
                <Button variant="outline" className="text-base px-6">
                  Registrarse Gratis
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No requiere tarjeta de crédito</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="bg-card rounded-lg p-6 space-y-4 shadow-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-foreground">Saldo Total</h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-foreground">S/. 24,580.50</div>
                <div className="flex gap-2 pt-2">
                  <div className="flex-1 bg-muted rounded p-3">
                    <p className="text-xs text-muted-foreground">Ingresos</p>
                    <p className="font-semibold text-foreground">S/. 8,450</p>
                  </div>
                  <div className="flex-1 bg-muted rounded p-3">
                    <p className="text-xs text-muted-foreground">Gastos</p>
                    <p className="font-semibold text-foreground">S/. 3,220</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Características poderosas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas para dominar tus finanzas personales en una plataforma intuitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg border border-border hover:border-primary/50 transition">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Planes simples y transparentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elige el plan perfecto para tus necesidades. Siempre puedes cambiar después.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg border transition ${
                plan.highlighted
                  ? 'border-primary bg-primary/5 ring-2 ring-primary scale-105'
                  : 'border-border hover:border-primary/50'
              } p-8`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Más Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>

              <Button
                onClick={handlePricingClick}
                className="w-full mb-6"
                variant={plan.highlighted ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Confían en nosotros
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Miles de usuarios ya están transformando su relación con el dinero.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm text-foreground italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comienza tu viaje financiero hoy
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya controlan sus finanzas. Sin costos ocultos, sin tarjeta requerida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-base px-6">
                Registrarse Gratis
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="text-base px-6">
                Tengo una cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">MiFinanzas</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tu plataforma para el control financiero personal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={handleDemoClick} className="hover:text-foreground transition">
                    Demo
                  </button>
                </li>
                <li>
                  <button onClick={handlePricingClick} className="hover:text-foreground transition">
                    Precios
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Características
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={handleContactClick} className="hover:text-foreground transition">
                    Privacidad
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={handleContactClick} className="hover:text-foreground transition">
                    Email
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 MiFinanzas. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
