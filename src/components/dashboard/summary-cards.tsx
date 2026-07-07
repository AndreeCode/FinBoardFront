'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/src/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, PieChart, Loader2, Banknote, ArrowRightLeft } from 'lucide-react'
import { formatSoles } from '@/src/lib/currency'
import { getDashboardData, DashboardData } from '@/src/lib/actions/dashboard'

type Period = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual'

interface SummaryCard {
  title: string
  amount: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
  bgColor: string
  textColor: string
}

export function SummaryCards() {
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
      console.log('Dashboard data:', result)
      if (result && result.summary) {
        setData(result)
      } else {
        console.error('Invalid dashboard data structure:', result)
        setData({
          summary: {
            total_income: 0,
            total_expenses: 0,
            total_investments: 0,
            total_credits: 0,
            you_owe: 0,
            you_are_owed: 0,
            balance: 0,
            average_income: 0,
            average_expenses: 0,
            savings: 0,
            savings_rate: 0
          },
          trends: [],
          by_category: [],
          daily_average: {
            daily_income: 0,
            daily_expenses: 0,
            weekly_income: 0,
            weekly_expenses: 0,
            monthly_income: 0,
            monthly_expenses: 0
          },
          period_comparison: []
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !data || !data.summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-4 flex items-center justify-center h-24">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards: SummaryCard[] = [
    {
      title: 'Saldo',
      amount: formatSoles(data.summary.balance),
      change: `${data.summary.savings_rate}% ahorro`,
      isPositive: data.summary.balance >= 0,
      icon: <Wallet className="h-6 w-6" />,
      bgColor: 'from-blue-500/10 to-blue-600/10',
      textColor: 'text-blue-500'
    },
    {
      title: 'Ingresos',
      amount: formatSoles(data.summary.total_income),
      change: `Promedio: ${formatSoles(data.summary.average_income)}`,
      isPositive: true,
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      bgColor: 'from-green-500/10 to-emerald-500/10',
      textColor: 'text-green-500'
    },
    {
      title: 'Gastos',
      amount: formatSoles(data.summary.total_expenses),
      change: `Promedio: ${formatSoles(data.summary.average_expenses)}`,
      isPositive: true,
      icon: <TrendingDown className="h-6 w-6 text-orange-500" />,
      bgColor: 'from-orange-500/10 to-red-500/10',
      textColor: 'text-orange-500'
    },
    {
      title: 'Inversiones',
      amount: formatSoles(data.summary.total_investments),
      change: `${data.summary.savings} ahorrado`,
      isPositive: true,
      icon: <PieChart className="h-6 w-6 text-purple-500" />,
      bgColor: 'from-purple-500/10 to-pink-500/10',
      textColor: 'text-purple-500'
    },
    {
      title: 'Te Deben',
      amount: formatSoles(data.summary.you_are_owed),
      change: 'Activos',
      isPositive: true,
      icon: <Banknote className="h-6 w-6 text-green-500" />,
      bgColor: 'from-green-500/10 to-emerald-500/10',
      textColor: 'text-green-500'
    },
    {
      title: 'Debes',
      amount: formatSoles(data.summary.you_owe),
      change: 'Pendientes',
      isPositive: false,
      icon: <ArrowRightLeft className="h-6 w-6 text-red-500" />,
      bgColor: 'from-red-500/10 to-orange-500/10',
      textColor: 'text-red-500'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['daily', 'weekly', 'monthly', 'quarterly', 'semiannual', 'annual'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              period === p
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {p === 'daily' ? 'Diario' :
             p === 'weekly' ? 'Semanal' :
             p === 'monthly' ? 'Mensual' :
             p === 'quarterly' ? 'Trimestral' :
             p === 'semiannual' ? 'Semestral' : 'Anual'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card, index) => (
          <Card key={index} className="border-border hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">{card.title}</p>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mt-1 break-words">{card.amount}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${card.bgColor} opacity-20 flex-shrink-0`}>
                  {card.icon}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <div className={`text-xs font-semibold ${card.textColor}`}>{card.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}