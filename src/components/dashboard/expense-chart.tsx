'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getDashboardData, DashboardData } from '@/src/lib/actions/dashboard'
import { formatSoles } from '@/src/lib/currency'
import { Loader2 } from 'lucide-react'

type Period = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual'

export function ExpenseChart() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [period, setPeriod] = useState<Period>('monthly')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  async function loadData() {
    setIsLoading(true)
    try {
      const result = await getDashboardData(period)
      setData(result)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !data || !data.trends) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base font-bold">Resumen</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const periodLabel = {
    daily: 'Día',
    weekly: 'Semana',
    monthly: 'Mes',
    quarterly: 'Trimestre',
    semiannual: 'Semestre',
    annual: 'Año'
  }

  const chartData = (data.trends || []).map((t) => ({
    mes: t.period,
    gastos: t.expenses,
    ingresos: t.income,
    inversiones: t.investments,
  }))

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-base font-bold">Resumen ({periodLabel[period]})</CardTitle>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="text-xs bg-transparent border border-border rounded px-2 py-1"
          >
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
            <option value="quarterly">Trimestral</option>
            <option value="semiannual">Semestral</option>
            <option value="annual">Anual</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="mes"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `S/${value}`}
            />
            <Tooltip
              formatter={(value: number) => formatSoles(value)}
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
  )
}