'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  Menu,
  Plus,
  Settings,
  TrendingUp,
  UtensilsCrossed,
  X,
  Wallet,
  LogOut,
} from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'
import { logout } from '@/src/lib/actions/auth'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
  { label: 'Ingresos', href: '/dashboard/income', icon: <Wallet className="w-5 h-5" /> },
  { label: 'Categorías', href: '/dashboard/categories', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Comidas', href: '/dashboard/meals', icon: <UtensilsCrossed className="w-5 h-5" /> },
  { label: 'Gastos', href: '/dashboard/expenses', icon: <CreditCard className="w-5 h-5" /> },
  { label: 'Inversiones', href: '/dashboard/investments', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Préstamos', href: '/dashboard/loans', icon: <DollarSign className="w-5 h-5" /> },
]

const settingsNav: NavItem[] = [
  { label: 'Configuración', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-full w-full bg-card border-r border-border flex flex-col">
      <div className="h-full flex flex-col p-4">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Mi Finanzas</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {mainNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 px-3"
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="border-t border-border pt-4 mb-4">
          <Button className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Gasto
          </Button>
        </div>

        <nav className="space-y-1 border-t border-border pt-4">
          {settingsNav.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 px-3"
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-3 px-3 text-destructive hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </Button>
          </form>
        </nav>
      </div>
    </aside>
  )
}
