'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/src/components/ui/card'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { getDashboardData, DashboardData } from '@/src/lib/actions/dashboard'
import { formatSoles } from '@/src/lib/currency'

type Period = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual'

export function PeriodComparison() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [period] = useState<Period>('monthly')
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

  if (isLoading || !data || !data.period_comparison || data.period_comparison.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-4 flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const current = data.period_comparison[data.period_comparison.length - 1]
  const previous = data.period_comparison[data.period_comparison.length - 2]

  if (!current || !previous) return null

  const incomeChange = previous.income > 0 ? ((current.income - previous.income) / previous.income) * 100 : 0
  const expenseChange = previous.expenses > 0 ? ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0
  const netFlowChange = previous.net_flow > 0 ? ((current.net_flow - previous.net_flow) / previous.net_flow) * 100 : 0

  const periodLabel = (p: string) => {
    if (p.includes('current')) return 'Mes actual'
    if (p.includes('last')) return 'Mes anterior'
    return p
  }

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ingresos</span>
            <div className="flex items-center gap-1">
              {incomeChange >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs font-semibold ${incomeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Gastos</span>
            <div className="flex items-center gap-1">
              {expenseChange <= 0 ? (
                <TrendingDown className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingUp className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs font-semibold ${expenseChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Flujo neto</span>
            <div className="flex items-center gap-1">
              {netFlowChange >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs font-semibold ${netFlowChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {netFlowChange >= 0 ? '+' : ''}{netFlowChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {periodLabel(current.period)}: {formatSoles(current.income)} ingresos, {formatSoles(current.expenses)} gastos
          </div>
        </div>
      </CardContent>
    </Card>
  )
}