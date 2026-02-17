'use client';

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { formatSoles } from '@/src/lib/currency';

type Period = 'daily' | 'weekly' | 'monthly';

export function AdvancedDashboard() {
  const [period, setPeriod] = useState<Period>('monthly');

  // Data for different periods
  const dailyData = [
    { date: 'Lun', income: 150, expenses: 80, profit: 70 },
    { date: 'Mar', income: 200, expenses: 120, profit: 80 },
    { date: 'Mié', income: 180, expenses: 95, profit: 85 },
    { date: 'Jue', income: 250, expenses: 110, profit: 140 },
    { date: 'Vie', income: 300, expenses: 150, profit: 150 },
    { date: 'Sáb', income: 280, expenses: 200, profit: 80 },
    { date: 'Dom', income: 220, expenses: 140, profit: 80 },
  ];

  const weeklyData = [
    { week: 'Sem 1', income: 1200, expenses: 650, profit: 550 },
    { week: 'Sem 2', income: 1450, expenses: 720, profit: 730 },
    { week: 'Sem 3', income: 1300, expenses: 680, profit: 620 },
    { week: 'Sem 4', income: 1550, expenses: 800, profit: 750 },
  ];

  const monthlyData = [
    { month: 'Ene', income: 5200, expenses: 2650, profit: 2550 },
    { month: 'Feb', income: 5400, expenses: 2800, profit: 2600 },
    { month: 'Mar', income: 5800, expenses: 2900, profit: 2900 },
    { month: 'Abr', income: 6200, expenses: 3100, profit: 3100 },
    { month: 'May', income: 6500, expenses: 3200, profit: 3300 },
    { month: 'Jun', income: 7100, expenses: 3400, profit: 3700 },
  ];
  type ChartData = {
  period: string
  income: number
  expenses: number
  profit: number
}
const weeklyDataFormatted: ChartData[] = weeklyData.map(d => ({
  period: d.week, // o date si usas date
  income: d.income,
  expenses: d.expenses,
  profit: d.profit,
}))



  const incomeSourcesData = [
    { name: 'Salario', value: 4500, color: '#8b5cf6' },
    { name: 'Inversiones', value: 2200, color: '#06b6d4' },
    { name: 'Freelance', value: 1400, color: '#10b981' },
  ];

  const expenseCategoriesData = [
    { name: 'Alimentación', value: 1200, color: '#f59e0b' },
    { name: 'Transporte', value: 600, color: '#3b82f6' },
    { name: 'Vivienda', value: 1200, color: '#ef4444' },
    { name: 'Entretenimiento', value: 300, color: '#a855f7' },
    { name: 'Otros', value: 200, color: '#64748b' },
  ];
  const monthlyDataFormatted: ChartData[] = monthlyData.map(d => ({
  period: d.month,
  income: d.income,
  expenses: d.expenses,
  profit: d.profit,
}))

const dailyDataFormatted: ChartData[] = dailyData.map(d => ({
  period: d.date,
  income: d.income,
  expenses: d.expenses,
  profit: d.profit,
}))


  let data: ChartData[] = monthlyDataFormatted

if (period === 'daily') data = dailyDataFormatted
else if (period === 'weekly') data = weeklyDataFormatted

  // Calculate totals
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalIncome - totalExpenses;
  const currentBalance = 12540;

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex gap-3">
        <Button
          variant={period === 'daily' ? 'default' : 'outline'}
          onClick={() => setPeriod('daily')}
        >
          Diario
        </Button>
        <Button
          variant={period === 'weekly' ? 'default' : 'outline'}
          onClick={() => setPeriod('weekly')}
        >
          Semanal
        </Button>
        <Button
          variant={period === 'monthly' ? 'default' : 'outline'}
          onClick={() => setPeriod('monthly')}
        >
          Mensual
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Balance */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dinero Actual</p>
                <h3 className="text-2xl font-bold text-foreground">{formatSoles(currentBalance)}</h3>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Income */}
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ganancias Totales</p>
                <h3 className="text-2xl font-bold text-green-600">{formatSoles(totalIncome)}</h3>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gastos Totales</p>
                <h3 className="text-2xl font-bold text-red-600">{formatSoles(totalExpenses)}</h3>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className={`bg-gradient-to-br ${totalProfit >= 0 ? 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20' : 'from-orange-500/10 to-orange-500/5 border-orange-500/20'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ganancia Neta</p>
                <h3 className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {formatSoles(totalProfit)}
                </h3>
              </div>
              <div className={`p-3 ${totalProfit >= 0 ? 'bg-emerald-500/20' : 'bg-orange-500/20'} rounded-lg`}>
                {totalProfit >= 0 ? (
                  <TrendingUp className={`w-6 h-6 ${totalProfit >= 0 ? 'text-emerald-600' : 'text-orange-600'}`} />
                ) : (
                  <TrendingDown className="w-6 h-6 text-orange-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Ganancias vs Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={period === 'daily' ? 'date' : period === 'weekly' ? 'week' : 'month'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Ingresos" />
                <Bar dataKey="expenses" fill="#ef4444" name="Gastos" />
                <Bar dataKey="profit" fill="#8b5cf6" name="Ganancia" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Ganancias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={period === 'daily' ? 'date' : period === 'weekly' ? 'week' : 'month'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  name="Ganancia Neta"
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Ingresos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Fuentes de Ingreso</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeSourcesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={100}
                  fill="#8b5cf6"
                  dataKey="value"
                >
                  {incomeSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategoriesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={100}
                  fill="#ef4444"
                  dataKey="value"
                >
                  {expenseCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
