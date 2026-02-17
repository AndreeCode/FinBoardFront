'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { ArrowRight, TrendingUp, BarChart3, Wallet, Target, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const handleCtaClick = (target: string) => {
    console.log(`[v0] CTA clicked: ${target}`);
    router.push(target);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">FinBoard</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Características
            </a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Beneficios
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Precios
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => handleCtaClick('/login')}>
              Iniciar Sesión
            </Button>
            <Button size="sm" onClick={() => handleCtaClick('/register')}>
              Registrarse
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-primary font-medium">Controla tus finanzas</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Tu gestor financiero personal inteligente
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Administra todos tus gastos, ingresos, inversiones y préstamos en un solo lugar. Visualiza tus finanzas en tiempo real con gráficos intuitivos y análisis detallados.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" onClick={() => handleCtaClick('/register')} className="gap-2">
                  Comenzar Gratis <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => handleCtaClick('/dashboard')}>
                  Ver Demo
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-muted-foreground">Sin tarjeta de crédito requerida</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-muted-foreground">Seguro y privado</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
              <Image
                src="/dashboard-hero.jpg"
                alt="Dashboard de finanzas"
                width={500}
                height={400}
                className="relative rounded-2xl shadow-2xl border border-border"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Características Principales</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar tus finanzas personales de manera eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Análisis Detallado',
                description: 'Visualiza tus datos financieros con gráficos interactivos y reportes completos'
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Inversiones',
                description: 'Monitorea tus inversiones y portafolio en tiempo real'
              },
              {
                icon: <Wallet className="w-6 h-6" />,
                title: 'Gastos Automáticos',
                description: 'Categoriza y registra tus gastos automáticamente'
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Metas Financieras',
                description: 'Establece y alcanza tus objetivos financieros'
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Feature 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <Image
                src="/analytics-feature.jpg"
                alt="Análisis financiero"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg border border-border"
              />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <h3 className="text-3xl font-bold text-foreground">Análisis Profundo de tus Finanzas</h3>
              <p className="text-muted-foreground leading-relaxed">
                Obtén insights detallados sobre tus patrones de gasto, ingresos y ahorros. Nuestros gráficos interactivos te muestran exactamente dónde va tu dinero.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowDownRight className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Gastos por categoría</p>
                    <p className="text-sm text-muted-foreground">Desglose completo de gastos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tendencias mensuales</p>
                    <p className="text-sm text-muted-foreground">Ve cómo cambia tu dinero</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-foreground">Gestión Inteligente de Inversiones</h3>
              <p className="text-muted-foreground leading-relaxed">
                Controla todas tus inversiones en un solo dashboard. Desde acciones hasta criptomonedas, visualiza tu portafolio y ganancias en tiempo real.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-3 h-3 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Múltiples activos</p>
                    <p className="text-sm text-muted-foreground">Acciones, ETFs, criptos y más</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Ganancias en vivo</p>
                    <p className="text-sm text-muted-foreground">Monitorea tu rendimiento</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image
                src="/investments-feature.jpg"
                alt="Inversiones"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg border border-border"
              />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <Image
                src="/transactions-feature.jpg"
                alt="Transacciones"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg border border-border"
              />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <h3 className="text-3xl font-bold text-foreground">Registro Automático de Transacciones</h3>
              <p className="text-muted-foreground leading-relaxed">
                Registra tus gastos e ingresos de forma sencilla. Categoriza automáticamente y mantén un historial completo de todas tus transacciones.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wallet className="w-3 h-3 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Transacciones rápidas</p>
                    <p className="text-sm text-muted-foreground">Interfaz intuitiva y rápida</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart3 className="w-3 h-3 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Historial completo</p>
                    <p className="text-sm text-muted-foreground">Acceso a todas tus transacciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Usuarios activos</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">$2B+</div>
              <p className="text-muted-foreground">Dinero gestionado</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">98%</div>
              <p className="text-muted-foreground">Satisfacción del usuario</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Planes Simples y Claros</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Elige el plan que mejor se adapta a tus necesidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Básico',
                price: 'Gratis',
                description: 'Perfecto para comenzar',
                features: ['Gastos básicos', 'Hasta 3 categorías', 'Reportes simples']
              },
              {
                name: 'Pro',
                price: 'S/. 29',
                period: '/mes',
                description: 'Para gestionar tus finanzas',
                features: ['Categorías ilimitadas', 'Inversiones', 'Análisis avanzado', 'Soporte prioritario'],
                highlighted: true
              },
              {
                name: 'Premium',
                price: 'S/. 99',
                period: '/mes',
                description: 'Control total de finanzas',
                features: ['Todo de Pro', 'Asesoramiento financiero', 'Múltiples cuentas', 'API acceso']
              }
            ].map((plan, idx) => (
              <div key={idx} className={`relative p-6 rounded-2xl border ${plan.highlighted ? 'border-primary bg-primary/5 md:scale-105' : 'border-border bg-card'}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">MÁS POPULAR</span>
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-foreground">{plan.price}</div>
                    {plan.period && <p className="text-sm text-muted-foreground">{plan.period}</p>}
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => handleCtaClick('/register')}
                  >
                    Comenzar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Comienza tu viaje financiero hoy</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya controlan sus finanzas con MisFinanzas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" onClick={() => handleCtaClick('/register')} className="gap-2">
              Registrarse Gratis <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30" onClick={() => handleCtaClick('/dashboard')}>
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-foreground">FinBoard</span>
              </div>
              <p className="text-sm text-muted-foreground">Tu gestor financiero personal inteligente</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Seguridad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 FinBoard. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
