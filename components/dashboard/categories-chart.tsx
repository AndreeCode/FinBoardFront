'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const expenseData = [
  { name: 'Vivienda', value: 1200, color: '#0ea5e9' },
  { name: 'Alimentación', value: 680, color: '#22c55e' },
  { name: 'Transporte', value: 450, color: '#f59e0b' },
  { name: 'Entretenimiento', value: 380, color: '#ec4899' },
  { name: 'Servicios', value: 310, color: '#8b5cf6' },
  { name: 'Otros', value: 200, color: '#6b7280' },
];

export function CategoriesChart() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm md:text-base font-bold">Gastos</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name }) => name}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value}`}
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
