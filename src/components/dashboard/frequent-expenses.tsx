'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatSoles } from '@/lib/currency';

interface FrequentExpense {
  id: string;
  name: string;
  category: string;
  icon: string;
  amount: number;
  frequency: string;
  trend: number;
  lastDate: string;
}

export function FrequentExpenses() {
  const expenses: FrequentExpense[] = [
    {
      id: '1',
      name: 'Café matinal',
      category: 'Alimentación',
      icon: '☕',
      amount: 5000,
      frequency: 'Diario',
      trend: 5,
      lastDate: 'Hoy',
    },
    {
      id: '2',
      name: 'Almuerzo',
      category: 'Alimentación',
      icon: '🍽️',
      amount: 15000,
      frequency: '5x/sem',
      trend: -2,
      lastDate: 'Hoy',
    },
    {
      id: '3',
      name: 'Gasolina',
      category: 'Transporte',
      icon: '⛽',
      amount: 60000,
      frequency: '1 vez/semana',
      trend: 10,
      lastDate: 'Sábado 4:15 PM',
    },
    {
      id: '4',
      name: 'Streaming (Netflix)',
      category: 'Entretenimiento',
      icon: '🎬',
      amount: 20000,
      frequency: 'Mensualmente',
      trend: 0,
      lastDate: '1 mes atrás',
    },
    {
      id: '5',
      name: 'Gimnasio',
      category: 'Salud',
      icon: '💪',
      amount: 50000,
      frequency: 'Mensualmente',
      trend: 0,
      lastDate: '1 mes atrás',
    },
    {
      id: '6',
      name: 'Transporte público',
      category: 'Transporte',
      icon: '🚌',
      amount: 3000,
      frequency: 'Diariamente',
      trend: 8,
      lastDate: 'Hoy 7:45 AM',
    },
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm md:text-base font-bold">Frecuentes</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {expenses.slice(0, 3).map((expense) => (
            <div
              key={expense.id}
              className="p-2 border border-border rounded hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg flex-shrink-0">{expense.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-xs truncate">
                      {expense.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {expense.frequency}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-sm font-bold text-foreground">
                    {formatSoles(expense.amount)}
                  </span>
                  {expense.trend !== 0 && (
                    <div
                      className={`flex items-center gap-0.5 text-xs font-semibold ${
                        expense.trend > 0 ? 'text-destructive' : 'text-green-600'
                      }`}
                    >
                      {expense.trend > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(expense.trend)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
