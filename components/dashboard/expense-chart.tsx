'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { mes: 'Ene', gastos: 2400, ingresos: 3200, inversiones: 1500 },
  { mes: 'Feb', gastos: 1398, ingresos: 3500, inversiones: 2100 },
  { mes: 'Mar', gastos: 2800, ingresos: 3800, inversiones: 2500 },
  { mes: 'Abr', gastos: 3908, ingresos: 4500, inversiones: 3200 },
  { mes: 'May', gastos: 4800, ingresos: 5200, inversiones: 3800 },
  { mes: 'Jun', gastos: 3800, ingresos: 4900, inversiones: 4100 },
];

export function ExpenseChart() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm md:text-base font-bold">Resumen (6 meses)</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="mes" 
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            <Bar dataKey="gastos" fill="#ef4444" name="Gastos" radius={[8, 8, 0, 0]} />
            <Bar dataKey="ingresos" fill="#22c55e" name="Ingresos" radius={[8, 8, 0, 0]} />
            <Bar dataKey="inversiones" fill="#8b5cf6" name="Inversiones" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
