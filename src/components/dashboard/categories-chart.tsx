'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { getDashboardData, DashboardData } from '@/src/lib/actions/dashboard'
import { formatSoles } from '@/src/lib/currency'
import { Loader2 } from 'lucide-react'

type Period = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual'

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6', '#6b7280', '#ef4444', '#14b8a6']

export function CategoriesChart() {
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

  if (isLoading || !data || !data.by_category) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base font-bold">Gastos</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const chartData = (data.by_category || []).map((cat, index) => ({
    name: cat.category_name,
    value: cat.total,
    color: COLORS[index % COLORS.length],
  }))

  const totalExpenses = data.by_category.reduce((sum, cat) => sum + cat.total, 0)

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-base font-bold">Gastos por Categoría</CardTitle>
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
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            Sin datos de gastos por categoría
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatSoles(value)}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-xs text-muted-foreground mt-2">
              Total: {formatSoles(totalExpenses)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}