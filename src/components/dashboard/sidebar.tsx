'use client';

import React from "react"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  LineChart,
  Wallet,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: <Home className="w-5 h-5" /> },
  {
    label: 'Análisis',
    href: '/analytics',
    icon: <LineChart className="w-5 h-5" />,
  },
  {
    label: 'Ingresos',
    href: '/income',
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    label: 'Categorías',
    href: '/categories',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Comidas',
    href: '/meals',
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
  {
    label: 'Gastos',
    href: '/expenses',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    label: 'Inversiones',
    href: '/investments',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: 'Préstamos',
    href: '/loans',
    icon: <DollarSign className="w-5 h-5" />,
  },
];

const settingsNav: NavItem[] = [
  { label: 'Configuración', href: '/settings', icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform duration-300 md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Mi Finanzas</h1>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-2">
            {mainNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3 px-4"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Action Button */}
          <div className="border-t border-border pt-4 mb-4">
            <Button className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Gasto
            </Button>
          </div>

          {/* Settings */}
          <nav className="space-y-2 border-t border-border pt-4">
            {settingsNav.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3 px-4"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
