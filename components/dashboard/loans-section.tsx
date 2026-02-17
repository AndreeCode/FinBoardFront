'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Banknote } from 'lucide-react';
import { formatSoles } from '@/lib/currency';

interface Loan {
  id: string;
  name: string;
  amount: string;
  paid: string;
  remaining: string;
  percentage: number;
  rate: string;
  nextPayment: string;
}

const loans: Loan[] = [
  {
    id: '1',
    name: 'Crédito Hipotecario',
    amount: formatSoles(180000.00),
    paid: formatSoles(45000.00),
    remaining: formatSoles(135000.00),
    percentage: 25,
    rate: '3.5% anual',
    nextPayment: `${formatSoles(850)} - 15 de febrero`
  },
  {
    id: '2',
    name: 'Préstamo Personal',
    amount: formatSoles(15000.00),
    paid: formatSoles(9000.00),
    remaining: formatSoles(6000.00),
    percentage: 60,
    rate: '8.2% anual',
    nextPayment: `${formatSoles(600)} - 10 de febrero`
  },
  {
    id: '3',
    name: 'Crédito Automotriz',
    amount: formatSoles(28000.00),
    paid: formatSoles(16800.00),
    remaining: formatSoles(11200.00),
    percentage: 60,
    rate: '5.1% anual',
    nextPayment: `${formatSoles(450)} - 20 de febrero`
  },
];

export function LoansSection() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Préstamos Activos</CardTitle>
          <Banknote className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan.id} className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{loan.name}</h4>
                  <p className="text-xs text-muted-foreground">Tasa: {loan.rate}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {loan.percentage}% pagado
                </Badge>
              </div>
              
              <div className="bg-secondary/30 rounded-full h-2 w-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${loan.percentage}%` }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div>
                  <p className="text-muted-foreground">Pagado</p>
                  <p className="font-semibold text-foreground">{loan.paid}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Restante</p>
                  <p className="font-semibold text-foreground">{loan.remaining}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold text-foreground">{loan.amount}</p>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-700 dark:text-green-400">
                  <span className="font-semibold">Próximo pago:</span> {loan.nextPayment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
