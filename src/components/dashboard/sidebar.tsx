'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  Menu,
  PieChart,
  Plus,
  Settings,
  TrendingUp,
  LogOut,
  X,
} from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { logout } from '@/src/lib/actions/auth'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
  { label: 'Ingresos', href: '/dashboard/income', icon: <DollarSign className="w-5 h-5" /> },
  { label: 'Gastos', href: '/dashboard/expenses', icon: <CreditCard className="w-5 h-5" /> },
  { label: 'Gastos x Categoría', href: '/dashboard/meals', icon: <PieChart className="w-5 h-5" /> },
  { label: 'Categorías', href: '/dashboard/categories', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Inversiones', href: '/dashboard/investments', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Préstamos', href: '/dashboard/loans', icon: <DollarSign className="w-5 h-5" /> },
]

const settingsNav: NavItem[] = [
  { label: 'Configuración', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const NavContent = () => (
    <>
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
          <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
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
        <Link href="/dashboard/expenses" onClick={() => setIsMobileOpen(false)}>
          <Button className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Gasto
          </Button>
        </Link>
      </div>

      <nav className="space-y-1 border-t border-border pt-4">
        {settingsNav.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
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
    </>
  )

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-background border border-border shadow-md lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between lg:hidden mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">Mi Finanzas</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileOpen(false)} className="p-0 h-auto">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <NavContent />
        </div>
      </aside>
    </>
  )
}