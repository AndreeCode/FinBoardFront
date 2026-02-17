'use client';

import React from "react"

import { Card, CardContent } from '@/src/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';
import { formatSoles } from '@/src/lib/currency';

interface SummaryCard {
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  bgColor: string;
}

export function SummaryCards() {
  const cards: SummaryCard[] = [
    {
      title: 'Saldo Total',
      amount: formatSoles(24580.50),
      change: '+12.5% este mes',
      isPositive: true,
      icon: <Wallet className="h-6 w-6" />,
      bgColor: 'from-blue-500/10 to-blue-600/10'
    },
    {
      title: 'Ingresos',
      amount: formatSoles(8450.00),
      change: '+18.2% vs mes anterior',
      isPositive: true,
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      bgColor: 'from-green-500/10 to-emerald-500/10'
    },
    {
      title: 'Gastos',
      amount: formatSoles(3220.75),
      change: '-5.1% vs mes anterior',
      isPositive: true,
      icon: <TrendingDown className="h-6 w-6 text-orange-500" />,
      bgColor: 'from-orange-500/10 to-red-500/10'
    },
    {
      title: 'Inversiones',
      amount: formatSoles(12900.00),
      change: '+8.3% rendimiento',
      isPositive: true,
      icon: <PieChart className="h-6 w-6 text-purple-500" />,
      bgColor: 'from-purple-500/10 to-pink-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, index) => (
        <Card key={index} className="border-border hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground truncate">{card.title}</p>
                <h3 className="text-lg md:text-xl font-bold text-foreground mt-1 break-words">{card.amount}</h3>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br opacity-20 flex-shrink-0">
                {card.icon}
              </div>
            </div>
            
            <div className="flex items-center gap-1 mt-2">
              {card.isPositive ? (
                <div className="text-xs font-semibold text-green-600 dark:text-green-400">↑ {card.change}</div>
              ) : (
                <div className="text-xs font-semibold text-red-600 dark:text-red-400">↓ {card.change}</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
