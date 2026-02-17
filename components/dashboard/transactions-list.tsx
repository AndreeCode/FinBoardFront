'use client';

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Home, 
  Bus, 
  Zap, 
  Coffee,
  TrendingUp,
  Wallet,
  DollarSign 
} from 'lucide-react';
import { formatSoles } from '@/lib/currency';

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: string;
  type: 'expense' | 'income' | 'investment';
  date: string;
  icon: React.ReactNode;
  color: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    title: 'Compra en Supermercado',
    category: 'Alimentación',
    amount: `-${formatSoles(125.50)}`,
    type: 'expense',
    date: 'Hoy, 2:30 PM',
    icon: <ShoppingCart className="h-4 w-4" />,
    color: 'text-blue-500'
  },
  {
    id: '2',
    title: 'Salario Mensual',
    category: 'Ingresos',
    amount: `+${formatSoles(4500.00)}`,
    type: 'income',
    date: 'Ayer',
    icon: <DollarSign className="h-4 w-4" />,
    color: 'text-green-500'
  },
  {
    id: '3',
    title: 'Pago de Renta',
    category: 'Vivienda',
    amount: `-${formatSoles(1200.00)}`,
    type: 'expense',
    date: '5 de enero',
    icon: <Home className="h-4 w-4" />,
    color: 'text-orange-500'
  },
  {
    id: '4',
    title: 'Inversión en Acciones',
    category: 'Inversiones',
    amount: `-${formatSoles(2000.00)}`,
    type: 'investment',
    date: '4 de enero',
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'text-purple-500'
  },
  {
    id: '5',
    title: 'Pasaje Transporte',
    category: 'Transporte',
    amount: `-${formatSoles(2.50)}`,
    type: 'expense',
    date: '3 de enero',
    icon: <Bus className="h-4 w-4" />,
    color: 'text-amber-500'
  },
  {
    id: '6',
    title: 'Pago de Servicios',
    category: 'Servicios',
    amount: '-$85.00',
    type: 'expense',
    date: '2 de enero',
    icon: <Zap className="h-4 w-4" />,
    color: 'text-yellow-500'
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'income':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'expense':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'investment':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    default:
      return '';
  }
};

export function TransactionsList() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm md:text-base font-bold">Transacciones</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {transactions.slice(0, 4).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-2 rounded border border-border hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`p-1.5 rounded text-sm flex-shrink-0 ${transaction.color}`}>
                  {transaction.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-xs truncate">{transaction.title}</h4>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className={`${getTypeColor(transaction.type)} border-0 text-xs py-0`}>
                  {transaction.category}
                </Badge>
                <span className={`font-bold text-sm ${
                  transaction.type === 'income' ? 'text-green-500' :
                  transaction.type === 'investment' ? 'text-purple-500' :
                  'text-foreground'
                }`}>
                  {transaction.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
