'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatSoles } from '@/src/lib/currency';

interface Investment {
  id: string;
  name: string;
  symbol: string;
  value: string;
  invested: string;
  gain: string;
  percentage: number;
  isPositive: boolean;
}

const investments: Investment[] = [
  {
    id: '1',
    name: 'Fondo Índice S&P 500',
    symbol: 'SPY',
    value: formatSoles(4250.00),
    invested: formatSoles(4000.00),
    gain: `+${formatSoles(250.00)}`,
    percentage: 6.25,
    isPositive: true
  },
  {
    id: '2',
    name: 'ETF Bonos Gobierno',
    symbol: 'BND',
    value: formatSoles(3100.00),
    invested: formatSoles(3000.00),
    gain: `+${formatSoles(100.00)}`,
    percentage: 3.33,
    isPositive: true
  },
  {
    id: '3',
    name: 'Acciones Tecnología',
    symbol: 'QQQ',
    value: formatSoles(2850.00),
    invested: formatSoles(3200.00),
    gain: `-${formatSoles(350.00)}`,
    percentage: -10.94,
    isPositive: false
  },
  {
    id: '4',
    name: 'Criptomonedas',
    symbol: 'BTC',
    value: formatSoles(2700.00),
    invested: formatSoles(2000.00),
    gain: `+${formatSoles(700.00)}`,
    percentage: 35.0,
    isPositive: true
  },
];

export function InvestmentsSection() {
  const totalValue = investments.reduce((acc, inv) => {
    const num = parseFloat(inv.value.replace('$', '').replace(',', ''));
    return acc + num;
  }, 0);

  const totalGain = investments.reduce((acc, inv) => {
    const num = parseFloat(inv.gain.replace('$', '').replace(',', '').replace('+', ''));
    return acc + (inv.isPositive ? num : -num);
  }, 0);

  return (
    <Card className="col-span-1 md:col-span-2 border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Mi Portafolio de Inversiones</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Valor total: <span className="font-semibold text-foreground">{formatSoles(totalValue)}</span> • 
              Ganancia: <span className={`font-semibold ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalGain >= 0 ? '+' : ''} {formatSoles(Math.abs(totalGain))}
              </span>
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Activo</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Invertido</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Valor Actual</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Ganancia</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Retorno</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">{inv.name}</p>
                      <p className="text-xs text-muted-foreground">{inv.symbol}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground font-medium">{inv.invested}</td>
                  <td className="py-4 px-4 text-foreground font-medium">{inv.value}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-semibold ${inv.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {inv.gain}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <Badge className={inv.isPositive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0'}>
                        {inv.isPositive ? '+' : ''}{inv.percentage.toFixed(2)}%
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
